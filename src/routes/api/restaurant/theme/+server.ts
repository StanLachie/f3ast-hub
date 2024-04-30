import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ locals, request }) => {
	const supabase = await locals.supabase;
	const { restaurant } = await locals.getClientAccount();
	const { value } = await request.json();

	if (!restaurant) {
		return new Response(JSON.stringify({ error: 'Not found' }), {
			status: 404,
			headers: { 'content-type': 'application/json' }
		});
	}

	await supabase.from('Restaurant').update({ theme: value }).eq('id', restaurant.id).select('*');

	return new Response(JSON.stringify({ value }), {
		headers: { 'content-type': 'application/json' }
	});
};
