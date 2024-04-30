import { decode } from 'base64-arraybuffer';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const { restaurant } = await locals.getClientAccount();
	const formData = Object.fromEntries(await request.formData());

	const menuImageFile = formData.menuImageFile as File;

	if (!restaurant) {
		return new Response(JSON.stringify({ error: 'Not found' }), {
			status: 404,
			headers: { 'content-type': 'application/json' }
		});
	}

	const fileName = `menuImg-${restaurant.id}-${Date.now()}`;

	await locals.supabase.storage
		.from('client-assets')
		.upload(fileName, decode(Buffer.from(await menuImageFile.arrayBuffer()).toString('base64')), {
			upsert: true,
			contentType: 'image/webp'
		});

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
