import { json, redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { auth } from "$lib/auth";
import prisma from "$lib/prisma";

export const POST: RequestHandler = async ({ request }) => {
  const { name, description } = await request.json();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    redirect(302, "/dashboard/login");
  }

  if (!name) {
    return json({ error: "Missing name" }, { status: 400 });
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

  // Get the highest sorting index
  const lastCategory = await prisma.menuCategory.findFirst({
    where: { restaurantId: restaurant.id },
    orderBy: { sortingIndex: "desc" },
  });

  const newCategory = await prisma.menuCategory.create({
    data: {
      name,
      description,
      restaurantId: restaurant.id,
      sortingIndex: (lastCategory?.sortingIndex ?? 0) + 1,
    },
  });

  return json({ category: newCategory });
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id, name, description } = await request.json();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    redirect(302, "/dashboard/login");
  }

  if (!name || !id) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  const updatedCategory = await prisma.menuCategory.update({
    where: { id },
    data: { name, description },
  });

  if (!updatedCategory) {
    return json({ error: "Category not found" }, { status: 404 });
  }

  return json({ category: updatedCategory });
};

export const DELETE: RequestHandler = async ({ request }) => {
  const { id } = await request.json();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    redirect(302, "/dashboard/login");
  }

  if (!id) {
    return json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.menuCategory.delete({
    where: { id },
  });

  return json({ id });
};
