import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

import { auth } from "$lib/auth";
import { createStripeCustomer } from "$lib/stripe/functions/customers";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ request }) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    console.log("no session user");
    redirect(303, "/dashboard/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { Restaurant: true },
  });

  if (user?.restaurantId) {
    redirect(303, "/dashboard/restaurant");
  }

  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      redirect(303, "/dashboard/login");
    }

    const data = await request.formData();
    const name = data.get("name");
    const address = data.get("address");
    const slug = data.get("slug");

    if (!name || !address || !slug) {
      return fail(400, {
        error: true,
        message: "All fields are required",
      });
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug.toString())) {
      return fail(400, {
        error: true,
        message: "Invalid slug format",
      });
    }

    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { slug: slug.toString() },
    });

    if (existingRestaurant) {
      return fail(400, {
        error: true,
        message: "This URL slug is already taken",
      });
    }

    const stripeCustomer = await createStripeCustomer(session.user.email);

    try {
      await prisma.$transaction(async (tx) => {
        const restaurant = await tx.restaurant.create({
          data: {
            name: name.toString(),
            address: address.toString(),
            slug: slug.toString(),
            active: true,
            published: false,
            updatedAt: new Date(),
            stripeCustomerId: stripeCustomer.id,
          },
        });

        await tx.user.update({
          where: { email: session.user.email },
          data: { restaurantId: restaurant.id },
        });
      });

      return { success: true };
    } catch (error) {
      console.error("Restaurant setup error:", error);
      return fail(500, {
        error: true,
        message: "Failed to create restaurant",
      });
    }
  },
};
