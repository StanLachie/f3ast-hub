import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ locals, request }) => {
	const session = await locals.getSession();
	const user = await locals.getUser();
	const { categories } = await request.json();

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

	for (const category of categories) {
		await prisma.menuCategory.update({
			where: {
				id: category.dbId
			},
			data: {
				sortingIndex: category.sortingIndex
			}
		});
	}
	return new Response();
};
