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

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return json({ error: "Not found" }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { inquiry_emails: value },
  });

  return json({ success: true });
};
