import prisma from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';
export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.getSession();
	const user = await locals.getUser();
	const { name, description } = await request.json();

	if (!name) {
		return new Response(JSON.stringify({ error: 'Missing fields' }), {
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

	const getSortingIndex = await prisma.menuCategory.findFirst({
		orderBy: {
			sortingIndex: 'desc'
		}
	});

	const category = await prisma.menuCategory.create({
		data: {
			name,
			description,
			sortingIndex: getSortingIndex ? getSortingIndex.sortingIndex + 1 : 0,
			restaurantId: user.restaurant.id
		}
	});

	return new Response(JSON.stringify({ category }), {
		headers: { 'content-type': 'application/json' }
	});
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	const session = await locals.getSession();
	const user = await locals.getUser();
	const { id, name, description } = await request.json();

	if (!name || !id) {
		return new Response(JSON.stringify({ error: 'Missing fields' }), {
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

	const category = await prisma.menuCategory.update({
		where: {
			id: parseInt(id)
		},
		data: {
			name,
			description
		}
	});

	return new Response(JSON.stringify({ category }), {
		headers: { 'content-type': 'application/json' }
	});
};

export const DELETE: RequestHandler = async ({ locals, url }) => {
	const session = await locals.getSession();
	const user = await locals.getUser();
	const id = url.searchParams.get('id');

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

	if (!id) {
		return new Response(JSON.stringify({ error: 'Missing fields' }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	const category = await prisma.menuCategory.delete({
		where: {
			id: parseInt(id)
		}
	});

	return new Response(JSON.stringify({ category }), {
		headers: { 'content-type': 'application/json' }
	});
};
