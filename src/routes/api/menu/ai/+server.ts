import { json, redirect } from "@sveltejs/kit";

import type { RequestHandler } from "../$types";
import { auth } from "$lib/auth";
import prisma from "$lib/prisma";
import { uploadImageAndPrompt } from "$lib/open-ai";

export const POST: RequestHandler = async ({ request }) => {
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

  const subscription = await prisma.subscription.findFirst({
    where: {
      restaurantId: restaurant.id,
    },
  });

  if (subscription?.tier !== "Elite") {
    return json(
      { error: "You are not authorized to use this feature" },
      { status: 403 }
    );
  }

  const { base64Image, prompt } = await request.json();
  const result = await uploadImageAndPrompt(base64Image, prompt);
  return json(result);
};
