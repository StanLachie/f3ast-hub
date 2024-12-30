import { json, redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { auth } from "$lib/auth";
import { createStripeCustomerPortalSession } from "$lib/stripe/functions/subscriptions";
import prisma from "$lib/prisma";

export const GET: RequestHandler = async ({ request }) => {
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
    return json({ error: "Restaurant not found" }, { status: 404 });
  }

  const customerPortalSession = await createStripeCustomerPortalSession(
    restaurant.id
  );

  return json({ url: customerPortalSession.url }, { status: 200 });
};
