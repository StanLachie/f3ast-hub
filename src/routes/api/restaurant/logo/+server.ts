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

  if (!image) {
    return json({ error: "No file selected" }, { status: 400 });
  }

  const fileName = `restaurants/${restaurant.id}/logo`;

  try {
    const path = await uploadFileToS3(image, fileName);

    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        logo: path,
      },
    });

    const url = await getFileUrlFromS3(path);

    return json({ success: true, url });
  } catch (error) {
    console.error(error);
    return json(
      {
        error: error instanceof Error ? error.message : "Failed to upload logo",
      },
      { status: 400 }
    );
  }
};
