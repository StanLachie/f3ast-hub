import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ locals, request }) => {
	const { items } = await request.json();

	for (let i = 0; i < items.length; i++) {
		const item = items[i];

		await locals.supabase
			.from('MenuCategory')
			.update({
				sortingIndex: i
			})
			.eq('id', item.dbId)
			.select('*');
	}
	return new Response();
};
