import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { getFileUrlFromS3 } from "$lib/s3";

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

    await Promise.all(
      categories.map(async (category) => {
        await Promise.all(
          category.MenuItems.map(async (item) => {
            if (item.img) {
              item.img = await getFileUrlFromS3(item.img);
            }
          })
        );
      })
    );

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
