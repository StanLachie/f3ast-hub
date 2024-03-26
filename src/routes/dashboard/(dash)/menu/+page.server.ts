import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load = (async ({ locals }) => {
	const session = await locals.getSession();
	let menuItems = [];

	if (!session) {
		redirect(302, '/dashboard/login');
	}

	const client = await prisma.clientAccount.findUnique({
		where: {
			email: session.user.email || ''
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

	const categories = await prisma.menuCategory.findMany({
		where: {
			restaurantId: restaurant.id
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
		session,
		restaurant,
		categories,
		menuItems: menuItems || [],
		client
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
	},
	createItem: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const price = data.get('price') as string;
		const categoryId = data.get('category') as string;

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

		const category = await prisma.menuCategory.findUnique({
			where: {
				id: parseInt(categoryId)
			}
		});

		console.log('category', category);

		if (!category) {
			error(404, 'Category not found');
		}

		await prisma.menuItem.create({
			data: {
				name,
				price: parseFloat(price),
				categoryId: category.id
			}
		});

		return {
			body: {
				success: true
			}
		};
	}
};
