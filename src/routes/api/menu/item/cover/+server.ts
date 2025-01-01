import { getFileUrlFromS3, uploadFileToS3 } from "$lib/s3";
import { json, redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { auth } from "$lib/auth";
import prisma from "$lib/prisma";

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
    return json({ error: "Not found" }, { status: 404 });
  }

  const formData = Object.fromEntries(await request.formData());
  const image = formData.image as File;
  const itemId = formData.itemId as string;

  if (!image || !itemId) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  const fileName = `restaurants/${restaurant.id}/menu-items/${itemId}`;

  try {
    const path = await uploadFileToS3(image, fileName);
    const url = await getFileUrlFromS3(path);

    await prisma.menuItem.update({
      where: { id: Number(itemId) },
      data: {
        img: path,
      },
    });

    return json({ success: true, url });
  } catch (error) {
    console.error(error);
    return json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload image",
      },
      { status: 400 }
    );
  }
};
