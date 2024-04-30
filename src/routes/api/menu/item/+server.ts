import type { RequestHandler } from '@sveltejs/kit';
export const POST: RequestHandler = async ({ locals, request }) => {
	const supabase = await locals.supabase;

	const { name, price, description, categoryId, img } = await request.json();

	if (!name || !price || !categoryId) {
		return new Response(JSON.stringify({ error: 'Missing fields' }), {
			status: 400,
			headers: {
				'content-type': 'application/json'
			}
		});
	}

	const { data: sortingIndexData, error: sortingIndexError } = await supabase
		.from('MenuItem')
		.select('*')
		.order('sortingIndex', { ascending: false })
		.limit(1);

	if (sortingIndexError) {
		console.log(sortingIndexError);
		return new Response(JSON.stringify({ error: 'Failed to get sorting index' }), {
			status: 400,
			headers: {
				'content-type': 'application/json'
			}
		});
	}

	const { data, error } = await supabase
		.from('MenuItem')
		.insert([
			{
				name,
				price,
				description,
				categoryId,
				img,
				sortingIndex: sortingIndexData?.[0]?.sortingIndex + 1
			}
		])
		.select('*');

	if (error) {
		console.log(error);
		return new Response(JSON.stringify({ error }), {
			status: 400,
			headers: {
				'content-type': 'application/json'
			}
		});
	}

	return new Response(JSON.stringify({ item: data[0] }), {
		headers: {
			'content-type': 'application/json'
		}
	});
};

export const PUT: RequestHandler = async ({ locals, request, url }) => {
	const supabase = locals.supabase;
	const id = url.searchParams.get('id');
	const { name, price, description, categoryId, img } = await request.json();

	console.log(categoryId);

	if (!name || !price || !categoryId) {
		return new Response(JSON.stringify({ error: 'Missing fields' }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	const { data, error } = await supabase
		.from('MenuItem')
		.update({
			name,
			price,
			description,
			categoryId,
			img
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

	return new Response(JSON.stringify({ item: data[0] }), {
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

	const { error } = await supabase.from('MenuItem').delete().eq('id', id).select('*');

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
