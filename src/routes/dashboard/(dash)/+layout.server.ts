import { auth } from "$lib/auth";
import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ request }) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    console.log("no session user");
    redirect(303, "/dashboard/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
  });

  if (!user?.restaurantId) {
    console.log("no restaurant id");
    redirect(303, "/dashboard/setup-restaurant");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: user?.restaurantId,
    },
  });

  if (!restaurant) {
    console.log("no restaurant");
    redirect(303, "/dashboard/login");
  }

  const subscription = await prisma.subscription.findUnique({
    where: {
      restaurantId: restaurant.id,
    },
  });

  return {
    layoutData: {
      session,
      restaurant,
      user,
      subscription,
    },
  };
}) satisfies LayoutServerLoad;
