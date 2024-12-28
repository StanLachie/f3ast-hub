import { json, redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { auth } from "$lib/auth";
import prisma from "$lib/prisma";

export const PUT: RequestHandler = async ({ request }) => {
  const { platform, url } = await request.json();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    redirect(302, "/dashboard/login");
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      Users: {
        some: {
          id: session.user.id,
        },
      },
    },
  });

  if (!restaurant) {
    return json({ error: "Not found" }, { status: 404 });
  }

  const validPlatforms = ["facebook", "instagram", "twitter", "tiktok"];
  if (!validPlatforms.some((p) => platform.includes(p))) {
    return json({ error: "Invalid platform" }, { status: 400 });
  }

  const updateData = validPlatforms.reduce(
    (data, p) => {
      if (platform.includes(p)) {
        data[p] = url;
      }
      return data;
    },
    {} as { [key: string]: string }
  );

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: updateData,
  });

  return json({ success: true });
};
