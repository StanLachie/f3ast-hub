import prisma from '$lib/prisma';
import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const body = await request.json();
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

	const category = await prisma.menuCategory.findUnique({
		where: {
			id: body.id
		}
	});

	if (!category) {
		return error(404, 'Category not found');
	}

	await prisma.menuCategory.delete({
		where: {
			id: category.id
		}
	});

	return json({ success: true });
};
