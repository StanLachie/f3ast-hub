import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const PUT: RequestHandler = async ({ request, locals }) => {
	const body = await request.json();
	const { item } = body;

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

	console.log(item);

	await prisma.menuItem.update({
		where: {
			id: item.dbId
		},
		data: {
			name: item.name,
			description: item.description,
			price: parseFloat(item.price),
			categoryId: parseInt(item.category)
		}
	});

	console.log('Updated item', item.dbId);

	return json({ item: item });
};
