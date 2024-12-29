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

  const existingUser = await prisma.user.findFirst({
    where: {
      name: value,
      NOT: {
        id: session.user.id,
      },
    },
  });

  if (existingUser) {
    return json({ error: "This username is already taken" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return json({ error: "User not found" }, { status: 404 });
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: value },
    });
  } catch (error) {
    return json({ error: "Failed to update username" }, { status: 500 });
  }

  return json({ value });
};
