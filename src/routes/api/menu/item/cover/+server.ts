import prisma from '$lib/prisma';
import { decode } from 'base64-arraybuffer';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.getSession();
	const user = await locals.getUser();
	const formData = Object.fromEntries(await request.formData());

	const menuImageFile = formData.menuImageFile as File;

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

	const restaurant = await prisma.restaurant.findUnique({
		where: {
			id: user.restaurant.id
		}
	});

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
