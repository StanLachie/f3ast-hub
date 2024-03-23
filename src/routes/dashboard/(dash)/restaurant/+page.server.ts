import prisma from '$lib/prisma.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	update: async ({ request, locals }) => {
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

		const data = await request.formData();
		const name = data.get('name') as string;
		const theme = data.get('theme') as string;
		const address = data.get('address') as string;

		const { data: userData } = await locals.supabase.auth.getUser();

		if (!userData.user || !userData.user.email) {
			return redirect(302, '/dashboard/login');
		}

		if (name) {
			await prisma.restaurant.update({
				where: {
					id: restaurant.id
				},
				data: {
					name: name
				}
			});
			return { success: true };
		} else if (address) {
			await prisma.restaurant.update({
				where: {
					id: restaurant.id
				},
				data: {
					address: address
				}
			});
			return { success: true };
		} else if (theme) {
			await prisma.restaurant.update({
				where: {
					id: restaurant.id
				},
				data: {
					theme: theme
				}
			});
			return { success: true };
		}

		return fail(500, {
			error: 'Server error. Please try again later.'
		});
	},
	publish: async ({ locals }) => {
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

		await prisma.restaurant.update({
			where: {
				id: restaurant.id
			},
			data: {
				published: !restaurant.published
			}
		});
	}
};
