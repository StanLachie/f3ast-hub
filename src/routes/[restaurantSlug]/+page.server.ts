import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const restaurant = await prisma.restaurant.findUnique({
		where: {
			slug: params.restaurantSlug
		}
	});

	if (!restaurant) {
		return error(404, 'Restaurant not found');
	}

	if (!restaurant.active || !restaurant.published) {
		return error(404, 'Restaurant not active');
	}

	const menuCategories = await prisma.menuCategory.findMany({
		where: {
			restaurantId: restaurant.id
		},
		include: {
			MenuItems: true
		}
	});

	return {
		restaurant,
		categories: menuCategories
	};
}) satisfies PageServerLoad;
