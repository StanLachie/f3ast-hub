import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { getFileUrlFromS3 } from "$lib/s3";

export const load = (async ({ parent }) => {
  const { layoutData } = await parent();

  const restaurant = layoutData.restaurant;

  if (!restaurant.logo) {
    return {
      restaurant,
    };
  }

  const logo = await getFileUrlFromS3(restaurant.logo);

  if (!logo) {
    return {
      logo: null,
      restaurant,
    };
  }

  return {
    logo,
    restaurant,
  };
}) satisfies PageServerLoad;
