import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	const session = await locals.getSession();
	const user = await locals.getUser();
	const { platform, url } = await request.json();

	const validPlatforms = ['facebook', 'instagram', 'twitter', 'tiktok'];

	if (!validPlatforms.some((p) => platform.includes(p))) {
		return new Response(JSON.stringify({ error: 'Invalid platform' }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	if (!session) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'content-type': 'application/json' }
		});
	}

	if (!user) {
		return new Response(JSON.stringify({ error: 'User not found' }), {
			status: 404,
			headers: { 'content-type': 'application/json' }
		});
	}

	const restaurant = await prisma.restaurant.findUnique({
		where: {
			id: user.restaurant.id
		}
	});

	if (!restaurant) {
		return new Response(JSON.stringify({ error: 'Not found' }), {
			status: 404,
			headers: { 'content-type': 'application/json' }
		});
	}

	const updateData: { [key: string]: string } = validPlatforms.reduce(
		(data, p) => {
			if (platform.includes(p)) {
				data[p] = url;
			}
			return data;
		},
		{} as { [key: string]: string }
	);

	await prisma.restaurant.update({
		where: {
			id: restaurant.id
		},
		data: updateData
	});

	return new Response(JSON.stringify({ platform, url }), {
		headers: { 'content-type': 'application/json' }
	});
};
