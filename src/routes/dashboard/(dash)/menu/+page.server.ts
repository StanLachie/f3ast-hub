import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import type { FileObject } from '@supabase/storage-js';

export const load = (async ({ locals, parent }) => {
	let menuItems: any[] = [];
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

	const categories = await prisma.menuCategory.findMany({
		where: {
			restaurantId: restaurant?.id || 9999
		}
	});

	if (categories) {
		for (const category of categories) {
			const items = await prisma.menuItem.findMany({
				where: {
					categoryId: category.id
				}
			});

			menuItems = [...menuItems, ...items];
		}
	}

	return {
		restaurant,
		categories,
		menuItems: menuItems || [],
		menuImages: menuImages || []
	};
}) satisfies PageServerLoad;

export const actions = {
	createCategory: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name') as string;

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

		const menuCategories = await prisma.menuCategory.findMany({
			where: {
				restaurantId: restaurant.id
			}
		});

		const sortingIndex = Math.max(...menuCategories.map((category) => category.sortingIndex)) + 1;

		const category = await prisma.menuCategory.create({
			data: {
				name,
				restaurantId: restaurant.id,
				sortingIndex: sortingIndex
			}
		});

		return {
			body: category
		};
	},
	deleteCategory: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name') as string;

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

		const category = await prisma.menuCategory.findFirst({
			where: {
				name: name,
				restaurantId: restaurant.id
			}
		});

		if (!category) {
			return {
				status: 404,
				body: {
					error: 'Category not found'
				}
			};
		}

		await prisma.menuCategory.delete({
			where: {
				id: category.id
			}
		});

		return {
			body: {
				success: true
			}
		};
	}
};
