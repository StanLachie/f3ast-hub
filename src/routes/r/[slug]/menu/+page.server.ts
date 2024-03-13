import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const { slug } = params;
	const restaurantInfo = await prisma.restaurant.findUnique({
		where: {
			slug: slug as string,
			active: true
		},
		select: {
			name: true,
			bio: true,
			address: true,
			banner: true,
			profilePhoto: true,
		}
	});

	if (!restaurantInfo) {
		throw error(404, 'Restaurant not found');
	}

	return {
		restaurantInfo
	};
}) satisfies PageServerLoad;
