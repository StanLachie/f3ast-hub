import prisma from '$lib/prisma';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		redirect(302, '/dashboard/login');
	}

	const layoutData = async () => {
		const client = await prisma.clientAccount.findUnique({
			where: {
				email: session.user.email
			}
		});

		if (!client) {
			redirect(302, '/dashboard/login');
		}

		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id: client.restaurantId || 0
			}
		});

		if (!restaurant) {
			redirect(302, '/dashboard/login');
		}

		const subscription = await prisma.subscription.findUnique({
			where: {
				restaurantId: restaurant.id
			}
		});

		if (!subscription) {
			return {
				error: 'Server error. Please try again later.'
			};
		}

		return {
			session,
			restaurant,
			client,
			subscription
		};
	};

	return {
		layoutData: layoutData()
	};
}) satisfies LayoutServerLoad;
