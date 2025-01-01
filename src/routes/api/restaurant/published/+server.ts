import { json, redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { auth } from "$lib/auth";
import prisma from "$lib/prisma";

export const PUT: RequestHandler = async ({ request }) => {
  const { value } = await request.json();
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

  const subscription = await prisma.subscription.findUnique({
    where: {
      restaurantId: restaurant.id,
    },
  });

  if (value && (!subscription || subscription.status !== "active")) {
    return json(
      { error: "You need to subscribe to publish your site!" },
      { status: 400 }
    );
  }

  const menuCategories = await prisma.menuCategory.findMany({
    where: {
      restaurantId: restaurant.id,
    },
    include: {
      MenuItems: true,
    },
  });

  if (
    menuCategories.length === 0 ||
    menuCategories.some((category) => category.MenuItems.length === 0)
  ) {
    return json(
      {
        error:
          "Your menu is empty, please add some items to your menu to publish your site!",
      },
      { status: 400 }
    );
  }

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { published: value },
  });

  return json({ success: true });
};
