import {
  F3AST_BASIC_PRICE_ID,
  F3AST_ELITE_PRICE_ID,
} from "$env/static/private";

import { PUBLIC_BASE_URL } from "$env/static/public";
import { createStripeClient } from "../stripe-client";
import { fail } from "@sveltejs/kit";
import prisma from "$lib/prisma";

export async function createStripeSubscriptionCheckoutSession(
  restaurantId: number,
  subscriptionTier: "Basic" | "Elite"
) {
  const stripe = createStripeClient();

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw fail(404, { message: "Restaurant not found" });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: restaurant.stripeCustomerId,
    line_items: [
      { price: getStripeSubscriptionPrice(subscriptionTier), quantity: 1 },
    ],
    mode: "subscription",
    success_url: `${PUBLIC_BASE_URL}dashboard/restaurant`,
    cancel_url: `${PUBLIC_BASE_URL}dashboard/billing`,
  });

  return checkoutSession;
}

export async function createStripeCustomerPortalSession(restaurantId: number) {
  const stripe = createStripeClient();

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw fail(404, { message: "Restaurant not found" });
  }

  const customerPortalSession = await stripe.billingPortal.sessions.create({
    customer: restaurant.stripeCustomerId,
    return_url: `${PUBLIC_BASE_URL}dashboard/billing`,
  });

  return customerPortalSession;
}

export function getStripeSubscriptionPrice(
  subscriptionTier: "Basic" | "Elite"
) {
  return subscriptionTier === "Basic"
    ? F3AST_BASIC_PRICE_ID
    : F3AST_ELITE_PRICE_ID;
}
