import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const PUT: RequestHandler = async ({ request, locals }) => {
	const body = await request.json();
	const { items } = body;

	const session = await locals.getSession();

	if (!session) {
		redirect(302, '/dashboard/login');
	}

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

	for (const item of items) {
		await prisma.menuItem.update({
			where: {
				id: item.dbId
			},
			data: {
				sortingIndex: item.sortingIndex
			}
		});

		console.log('Updated category', item.id);
	}

	return json({ items: items });
};
