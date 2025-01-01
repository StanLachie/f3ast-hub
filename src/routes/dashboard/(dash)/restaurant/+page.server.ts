import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { getFileUrlFromS3 } from "$lib/s3";

export const load = (async ({ parent }) => {
  const { layoutData } = await parent();

  const restaurant = layoutData.restaurant;

  const logo = restaurant.logo ? await getFileUrlFromS3(restaurant.logo) : null;
  const banner = restaurant.banner
    ? await getFileUrlFromS3(restaurant.banner)
    : null;

  return {
    logo,
    banner,
    restaurant,
  };
}) satisfies PageServerLoad;
