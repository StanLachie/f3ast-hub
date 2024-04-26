import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

interface MenuItem {
	id: number;
	active: boolean;
	name: string;
	price: number;
	img: string | null;
	categoryId: number | null;
	sortingIndex: number;
	description: string | null;
}

export const load = (async ({ parent }) => {
	const { layoutData } = await parent();
	const { restaurant } = await layoutData;

	const pageData = async () => {
		let menuItems: MenuItem[] = [];

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

			return {
				categories,
				menuItems
			};
		}
	};

	return {
		restaurant,
		pageData: pageData()
	};
}) satisfies PageServerLoad;
