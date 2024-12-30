import type Stripe from "stripe";
import type { SubscriptionStatus } from "@prisma/client";
import prisma from "$lib/prisma";

export async function handleCustomerSubscriptionCreated(
  event: Stripe.CustomerSubscriptionCreatedEvent
) {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      stripeCustomerId: String(event.data.object.customer),
    },
  });

  if (!restaurant) {
    console.error("Restaurant not found");
    return;
  }

  const subscription = await prisma.subscription.create({
    data: {
      restaurantId: restaurant.id,
      status: event.data.object.status as SubscriptionStatus,
      stripeSubscriptionId: event.data.object.id,
      stripeCustomerId: String(event.data.object.customer),
      currentPeriodStart: new Date(
        event.data.object.current_period_start * 1000
      ),
      currentPeriodEnd: new Date(event.data.object.current_period_end * 1000),
    },
  });

  return subscription;
}

export async function handleCustomerSubscriptionUpdated(
  event: Stripe.CustomerSubscriptionUpdatedEvent
) {
  const subscription = await prisma.subscription.upsert({
    where: {
      stripeSubscriptionId: event.data.object.id,
    },
    create: {
      stripeSubscriptionId: event.data.object.id,
      stripeCustomerId: String(event.data.object.customer),
      status: event.data.object.status as SubscriptionStatus,
      currentPeriodStart: new Date(
        event.data.object.current_period_start * 1000
      ),
      currentPeriodEnd: new Date(event.data.object.current_period_end * 1000),
      restaurantId: (
        await prisma.restaurant.findUniqueOrThrow({
          where: { stripeCustomerId: String(event.data.object.customer) },
        })
      ).id,
    },
    update: {
      status: event.data.object.status as SubscriptionStatus,
      currentPeriodStart: new Date(
        event.data.object.current_period_start * 1000
      ),
      currentPeriodEnd: new Date(event.data.object.current_period_end * 1000),
    },
  });

  return subscription;
}
