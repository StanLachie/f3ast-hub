import { decode } from 'base64-arraybuffer';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { restaurant } = await locals.getClientAccount();
	const formData = Object.fromEntries(await request.formData());

	const image = formData.image as File;

	if (!image) {
		return new Response(JSON.stringify({ error: 'No file selected' }), {
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

	const fileName = `banner-${restaurant.id}`;

	const { data, error } = await locals.supabase.storage
		.from('client-assets')
		.upload(fileName, decode(Buffer.from(await image.arrayBuffer()).toString('base64')), {
			upsert: true,
			contentType: 'image/webp'
		});

	if (error || !data) {
		console.log(error);
		return new Response(JSON.stringify({ error }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	const { data: bannerData, error: bannerError } = await locals.supabase
		.from('Restaurant')
		.update({
			banner: `https://cpqmfpdmwfoaxcxituch.supabase.co/storage/v1/object/public/client-assets/${fileName}`
		})
		.eq('id', restaurant.id)
		.select('*');

	if (bannerError || !bannerData) {
		console.log(bannerError);
		return new Response(JSON.stringify({ error: 'Failed to update banner' }), {
			status: 400,
			headers: { 'content-type': 'application/json' }
		});
	}

	return new Response(
		JSON.stringify({
			success: true,
			url: `https://cpqmfpdmwfoaxcxituch.supabase.co/storage/v1/object/public/client-assets/${fileName}`
		}),
		{
			headers: { 'content-type': 'application/json' }
		}
	);
};
