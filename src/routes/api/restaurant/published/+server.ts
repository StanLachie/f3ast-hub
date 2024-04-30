import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ locals, request }) => {
	const supabase = await locals.supabase;
	const { restaurant } = await locals.getClientAccount();
	const { value } = await request.json();

	const { error } = await supabase
		.from('Restaurant')
		.update({ published: value })
		.eq('id', restaurant.id)
		.select('*');

	if (error) {
		console.log(error);
		return new Response(JSON.stringify({ error }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	return new Response(JSON.stringify({ value }), {
		headers: { 'content-type': 'application/json' }
	});
};
