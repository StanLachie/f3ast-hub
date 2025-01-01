import { json, redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { auth } from "$lib/auth";
import prisma from "$lib/prisma";

export const POST: RequestHandler = async ({ request }) => {
  const { name, price, description, categoryId, img } = await request.json();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    redirect(302, "/dashboard/login");
  }

  if (!name || !price || !categoryId) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  // Get the highest sorting index
  const lastItem = await prisma.menuItem.findFirst({
    orderBy: { sortingIndex: "desc" },
  });

  const newItem = await prisma.menuItem.create({
    data: {
      name,
      price,
      description,
      categoryId,
      img,
      sortingIndex: (lastItem?.sortingIndex ?? 0) + 1,
    },
  });

  return json({ item: newItem });
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id, name, price, description, categoryId, img } =
    await request.json();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    redirect(302, "/dashboard/login");
  }

  if (!name || !price || !categoryId) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  const updatedItem = await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      price,
      description,
      categoryId,
    },
  });

  return json({ item: updatedItem });
};

export const DELETE: RequestHandler = async ({ request }) => {
  const { id } = await request.json();

  console.log(id);

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    redirect(302, "/dashboard/login");
  }

  if (!id) {
    return json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.menuItem.delete({
    where: { id },
  });

  return json({ id });
};
