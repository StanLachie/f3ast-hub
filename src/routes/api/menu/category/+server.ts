// import prisma from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';
export const POST: RequestHandler = async ({ locals, request }) => {
	const supabase = await locals.supabase;
	const { restaurant } = await locals.getClientAccount();
	const { name, description } = await request.json();

	if (!name) {
		return new Response(JSON.stringify({ error: 'Missing fields' }), {
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

	const { data: sortingIndexData, error: sortingIndexError } = await supabase
		.from('MenuCategory')
		.select('*')
		.eq('restaurantId', restaurant.id)
		.order('sortingIndex', { ascending: false })
		.limit(1);

	if (sortingIndexError) {
		console.log(sortingIndexError);
		return new Response(JSON.stringify({ error: 'Failed to get sorting index' }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	console.log(sortingIndexData);

	const { data, error } = await supabase
		.from('MenuCategory')
		.insert([
			{
				name,
				description,
				sortingIndex: sortingIndexData?.[0]?.sortingIndex + 1 || 0,
				restaurantId: restaurant?.id
			}
		])
		.select('*');

	if (error) {
		console.log(error);
		return new Response(JSON.stringify({ error }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	return new Response(JSON.stringify({ category: data[0] }), {
		headers: { 'content-type': 'application/json' }
	});
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	const supabase = await locals.supabase;
	const { id, name, description } = await request.json();

	console.log(description);

	if (!name || !id) {
		return new Response(JSON.stringify({ error: 'Missing fields' }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	const { data, error } = await supabase
		.from('MenuCategory')
		.update({
			name,
			description
		})
		.eq('id', id)
		.select('*');

	if (error) {
		console.log(error);
		return new Response(JSON.stringify({ error }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	if (data && data.length === 0) {
		return new Response(
			JSON.stringify({ error: 'No record updated, check if the id is correct' }),
			{
				status: 404,
				headers: { 'content-type': 'application/json' }
			}
		);
	}

	return new Response(JSON.stringify({ category: data[0] }), {
		headers: { 'content-type': 'application/json' }
	});
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const supabase = await locals.supabase;
	const { id } = await request.json();

	if (!id) {
		return new Response(JSON.stringify({ error: 'Missing fields' }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	const { error } = await supabase.from('MenuCategory').delete().eq('id', id).select('*');

	if (error) {
		console.log(error);
		return new Response(JSON.stringify({ error }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	return new Response(JSON.stringify({ id }), {
		headers: { 'content-type': 'application/json' }
	});
};
