import {
  handleCustomerSubscriptionCreated,
  handleCustomerSubscriptionDeleted,
  handleCustomerSubscriptionUpdated,
} from "$lib/stripe/events/customerSubscription";
import { json, redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { STRIPE_WEBHOOK_SECRET } from "$env/static/private";
import { auth } from "$lib/auth";
import { createStripeClient } from "$lib/stripe/stripe-client";
import { createStripeSubscriptionCheckoutSession } from "$lib/stripe/functions/subscriptions";
import prisma from "$lib/prisma";

const arrayBufferToBuffer = (arrayBuffer: ArrayBuffer): Buffer => {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  buffer.set(view);
  return buffer;
};

export const GET: RequestHandler = async ({ request, url }) => {
  const subscriptionTier = url.searchParams.get("subscriptionTier");
  const term = url.searchParams.get("term");
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!subscriptionTier || !["Basic", "Elite"].includes(subscriptionTier)) {
    return json({ error: "Invalid subscriptionTier" }, { status: 400 });
  }

  if (!term || !["monthly", "yearly"].includes(term)) {
    return json({ error: "Invalid term" }, { status: 400 });
  }

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

  const checkoutSession = await createStripeSubscriptionCheckoutSession(
    restaurant.id,
    subscriptionTier as "Basic" | "Elite",
    term as "monthly" | "yearly"
  );

  return json({ url: checkoutSession.url, status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
  const stripe = createStripeClient();
  const signature = request.headers.get("stripe-signature");
  let event;

  if (!signature) {
    return json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  try {
    event = stripe.webhooks.constructEvent(
      arrayBufferToBuffer(await request.arrayBuffer()),
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err);
    return json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
      await handleCustomerSubscriptionCreated(event);

      console.log("subscription created");

      break;
    case "customer.subscription.updated":
      await handleCustomerSubscriptionUpdated(event);

      console.log("subscription updates");

      break;
    case "customer.subscription.deleted":
      await handleCustomerSubscriptionDeleted(event);

      console.log("subscription deleted");

      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
      return json(
        { error: `Unhandled event type: ${event.type}` },
        { status: 400 }
      );
  }

  return json({ message: "Webhook processed successfully" }, { status: 200 });
};
