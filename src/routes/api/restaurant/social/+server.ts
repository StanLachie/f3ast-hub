import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	const supabase = await locals.supabase;
	const { restaurant } = await locals.getClientAccount();
	const { platform, url } = await request.json();

	const validPlatforms = ['facebook', 'instagram', 'twitter', 'tiktok'];

	if (!validPlatforms.some((p) => platform.includes(p))) {
		return new Response(JSON.stringify({ error: 'Invalid platform' }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

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

	const { error } = await supabase
		.from('Restaurant')
		.update(updateData)
		.eq('id', restaurant.id)
		.select('*');

	if (error) {
		console.log(error);
		return new Response(JSON.stringify({ error }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	return new Response(JSON.stringify({ platform, url }), {
		headers: { 'content-type': 'application/json' }
	});
};
