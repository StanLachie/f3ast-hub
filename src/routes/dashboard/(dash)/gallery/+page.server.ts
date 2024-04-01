import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import sharp from 'sharp';
import { decode } from 'base64-arraybuffer';
import prisma from '$lib/prisma';
import type { FileObject } from '@supabase/storage-js';

export const load = (async ({ locals, parent }) => {
	let menuImages: FileObject[] = [];
	const { layoutData } = await parent();
	const { restaurant } = await layoutData;

	const assets = await locals.supabase.storage
		.from('client-assets')
		.list()
		.then((res) => {
			return res.data;
		});

	if (assets) {
		menuImages = assets.filter((asset) => asset.name.includes(`menuImg-${restaurant?.id}`));
	}

	return {
		menuImages
	};
}) satisfies PageServerLoad;

export const actions = {
	uploadLogo: async ({ request, locals }) => {
		const session = await locals.getSession();

		if (!session) {
			redirect(302, '/dashboard/login');
		}

		const client = await prisma.clientAccount.findUnique({
			where: {
				email: session.user.email
			}
		});

		if (!client) {
			redirect(302, '/dashboard/login');
		}

		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id: client.restaurantId || 0
			}
		});

		if (!restaurant) {
			redirect(302, '/dashboard/login');
		}

		const formData = Object.fromEntries(await request.formData());

		if (!(formData.logoFile as File).name || (formData.logoFile as File).name === 'undefined') {
			return fail(400, {
				error: true,
				message: 'You must provide a file to upload'
			});
		}

		const { logoFile } = formData as { logoFile: File };

		const formattedFile = sharp(await logoFile.arrayBuffer())
			.resize(200, 200)
			.webp()
			.toBuffer();

		const logo = await locals.supabase.storage
			.from('client-assets')
			.upload(
				`logo-${restaurant.id}`,
				decode(Buffer.from(await formattedFile).toString('base64')),
				{
					upsert: true,
					contentType: 'image/webp',
					cacheControl: '10'
				}
			);

		await prisma.restaurant.update({
			where: {
				id: restaurant.id
			},
			data: {
				logo: `https://cpqmfpdmwfoaxcxituch.supabase.co/storage/v1/object/public/${logo.data?.path}`
			}
		});

		return {
			success: true
		};
	},
	uploadBanner: async ({ request, locals }) => {
		const session = await locals.getSession();

		if (!session) {
			redirect(302, '/dashboard/login');
		}

		const client = await prisma.clientAccount.findUnique({
			where: {
				email: session.user.email
			}
		});

		if (!client) {
			redirect(302, '/dashboard/login');
		}

		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id: client.restaurantId || 0
			}
		});

		if (!restaurant) {
			redirect(302, '/dashboard/login');
		}

		const formData = Object.fromEntries(await request.formData());

		if (!(formData.bannerFile as File).name || (formData.bannerFile as File).name === 'undefined') {
			return fail(400, {
				error: true,
				message: 'You must provide a file to upload'
			});
		}

		const { bannerFile } = formData as { bannerFile: File };

		const formattedFile = sharp(await bannerFile.arrayBuffer())
			.resize(1250, 600)
			.webp()
			.toBuffer();

		const banner = await locals.supabase.storage
			.from('client-assets')
			.upload(
				`banner-${restaurant.id}`,
				decode(Buffer.from(await formattedFile).toString('base64')),
				{
					upsert: true,
					contentType: 'image/webp',
					cacheControl: '10'
				}
			);

		await prisma.restaurant.update({
			where: {
				id: restaurant.id
			},
			data: {
				banner: `https://cpqmfpdmwfoaxcxituch.supabase.co/storage/v1/object/public/${banner.data?.path}`
			}
		});

		return {
			success: true
		};
	},
	uploadMenuImage: async ({ request, locals }) => {
		const session = await locals.getSession();

		if (!session) {
			redirect(302, '/dashboard/login');
		}

		const client = await prisma.clientAccount.findUnique({
			where: {
				email: session.user.email
			}
		});

		if (!client) {
			redirect(302, '/dashboard/login');
		}

		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id: client.restaurantId || 0
			}
		});

		if (!restaurant) {
			redirect(302, '/dashboard/login');
		}

		const formData = Object.fromEntries(await request.formData());

		if (
			!(formData.menuImageFile as File).name ||
			(formData.menuImageFile as File).name === 'undefined'
		) {
			return fail(400, {
				error: true,
				message: 'You must provide a file to upload'
			});
		}

		const { menuImageFile } = formData as { menuImageFile: File };

		const formattedFile = sharp(await menuImageFile.arrayBuffer())
			.resize(800, 800)
			.webp()
			.toBuffer();

		await locals.supabase.storage
			.from('client-assets')
			.upload(
				`menuImg-${restaurant.id}-${Date.now()}`,
				decode(Buffer.from(await formattedFile).toString('base64')),
				{
					contentType: 'image/webp',
					cacheControl: '10'
				}
			);

		return {
			success: true
		};
	}
};
