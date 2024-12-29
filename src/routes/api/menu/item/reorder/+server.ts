import { json, redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { auth } from "$lib/auth";
import prisma from "$lib/prisma";

export const PUT: RequestHandler = async ({ request }) => {
  const { items } = await request.json();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    redirect(302, "/dashboard/login");
  }

  if (!items || !Array.isArray(items)) {
    return json({ error: "Invalid items array" }, { status: 400 });
  }

  await prisma.$transaction(
    items.map((item, index) =>
      prisma.menuItem.update({
        where: { id: item.id },
        data: { sortingIndex: index },
      })
    )
  );

  return json({ success: true });
};
