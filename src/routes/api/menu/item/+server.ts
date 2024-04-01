import prisma from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';
export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.getSession();
	const { name, price, description, categoryId, img } = await request.json();

	if (!name || !price || !categoryId) {
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

	const getSortingIndex = await prisma.menuItem.findFirst({
		orderBy: {
			sortingIndex: 'desc'
		}
	});

	const item = await prisma.menuItem.create({
		data: {
			name: name,
			price: price,
			description: description,
			img: img || null,
			sortingIndex: getSortingIndex ? getSortingIndex.sortingIndex + 1 : 0,
			MenuCategory: {
				connect: {
					id: categoryId
				}
			}
		}
	});

	return new Response(JSON.stringify({ item }), {
		headers: { 'content-type': 'application/json' }
	});
};

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.getSession();
	const id = url.searchParams.get('id');

	if (!session) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'content-type': 'application/json' }
		});
	}

	if (!id) {
		const items = await prisma.menuItem.findMany();

		return new Response(JSON.stringify({ items }), {
			headers: { 'content-type': 'application/json' }
		});
	} else {
		const item = await prisma.menuItem.findUnique({
			where: {
				id: parseInt(id)
			}
		});

		if (!item) {
			return new Response(JSON.stringify({ error: 'Not found' }), {
				status: 404,
				headers: { 'content-type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({ item }), {
			headers: { 'content-type': 'application/json' }
		});
	}
};

export const PUT: RequestHandler = async ({ locals, request, url }) => {
	const session = await locals.getSession();
	const id = url.searchParams.get('id');
	const { name, price, description, categoryId, img } = await request.json();

	console.log(img);

	if (!id) {
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

	const item = await prisma.menuItem.findUnique({
		where: {
			id: parseInt(id)
		},
		include: {
			MenuCategory: true
		}
	});

	if (!item) {
		return new Response(JSON.stringify({ error: 'Not found' }), {
			status: 404,
			headers: { 'content-type': 'application/json' }
		});
	}

	const updatedItem = await prisma.menuItem.update({
		where: {
			id: parseInt(id)
		},
		data: {
			name: name || item.name,
			price: price || item.price,
			description: description || item.description,
			img: img || item.img,
			MenuCategory: {
				connect: {
					id: categoryId || item.MenuCategory.id
				}
			}
		}
	});

	return new Response(JSON.stringify({ item: updatedItem }), {
		headers: { 'content-type': 'application/json' }
	});
};

export const DELETE: RequestHandler = async ({ locals, url }) => {
	const session = await locals.getSession();
	const id = url.searchParams.get('id');

	if (!session) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'content-type': 'application/json' }
		});
	}

	if (!id) {
		return new Response(JSON.stringify({ error: 'Missing fields' }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	const item = await prisma.menuItem.findUnique({
		where: {
			id: parseInt(id)
		}
	});

	if (!item) {
		return new Response(JSON.stringify({ error: 'Not found' }), {
			status: 404,
			headers: { 'content-type': 'application/json' }
		});
	}

	await prisma.menuItem.delete({
		where: {
			id: parseInt(id)
		}
	});

	return new Response(JSON.stringify({ success: true }), {
		headers: { 'content-type': 'application/json' }
	});
};
