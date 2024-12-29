import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load = (async ({ parent }) => {
  const { layoutData } = await parent();
  const { restaurant } = await layoutData;

  if (!restaurant?.id) {
    throw new Error("Restaurant not found");
  }

  const pageData = async () => {
    const categories = await prisma.menuCategory.findMany({
      where: { restaurantId: restaurant.id },
      include: { MenuItems: true },
    });

    return {
      categories,
      menuItems: categories.flatMap((category) => category.MenuItems),
    };
  };

  return {
    restaurant,
    pageData: pageData(),
  };
}) satisfies PageServerLoad;
