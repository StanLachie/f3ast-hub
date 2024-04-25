import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ locals, request }) => {
	const session = await locals.getSession();
	const user = await locals.getUser();
	const { value } = await request.json();

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

	await prisma.restaurant.update({
		where: {
			id: restaurant.id
		},
		data: {
			address: value
		}
	});

	return new Response(JSON.stringify({ value }), {
		headers: { 'content-type': 'application/json' }
	});
};