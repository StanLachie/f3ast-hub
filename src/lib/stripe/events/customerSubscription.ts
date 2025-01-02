import type Stripe from "stripe";
import type { SubscriptionStatus } from "@prisma/client";
import { getStripeSubscriptionPrice } from "../functions/subscriptions";
import prisma from "$lib/prisma";

// import type { SubscriptionStatus } from "@prisma/client";

export async function handleCustomerSubscriptionCreated(
  event: Stripe.CustomerSubscriptionCreatedEvent
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        stripeCustomerId: String(event.data.object.customer),
      },
      include: {
        Subscription: true,
      },
    });

    if (!restaurant) {
      throw new Error(
        `Restaurant not found for customer ID: ${event.data.object.customer}`
      );
    }

    if (restaurant.Subscription) {
      const subscription = await prisma.subscription.update({
        where: {
          restaurantId: restaurant.id,
        },
        data: {
          status: event.data.object.status as any,
          stripeSubscriptionId: event.data.object.id,
          stripeCustomerId: String(event.data.object.customer),
          currentPeriodStart: new Date(
            event.data.object.current_period_start * 1000
          ),
          currentPeriodEnd: new Date(
            event.data.object.current_period_end * 1000
          ),
          canceledAt: null,
        },
      });
      return subscription;
    }

    const subscription = await prisma.subscription.create({
      data: {
        restaurantId: restaurant.id,
        status: event.data.object.status as any,
        stripeSubscriptionId: event.data.object.id,
        tier:
          event.data.object.items.data[0].plan.id ===
          "price_1OYiywJkLTgCVE9z34dDdKwq"
            ? "Elite"
            : "Basic",
        stripeCustomerId: String(event.data.object.customer),
        currentPeriodStart: new Date(
          event.data.object.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(event.data.object.current_period_end * 1000),
      },
    });

    return subscription;
  } catch (error) {
    console.error("Error in handleCustomerSubscriptionCreated:", error);
    throw error;
  }
}

export async function handleCustomerSubscriptionUpdated(
  event: Stripe.CustomerSubscriptionUpdatedEvent
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        stripeCustomerId: String(event.data.object.customer),
      },
    });

    if (!restaurant) {
      throw new Error(
        `Restaurant not found for customer ID: ${event.data.object.customer}`
      );
    }

    const subscription = await prisma.subscription.update({
      where: {
        restaurantId: restaurant.id,
      },
      data: {
        status: event.data.object.status as SubscriptionStatus,
        stripeSubscriptionId: event.data.object.id,
        currentPeriodStart: new Date(
          event.data.object.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(event.data.object.current_period_end * 1000),
        canceledAt: event.data.object.cancel_at
          ? new Date(event.data.object.cancel_at * 1000)
          : null,
      },
    });

    return subscription;
  } catch (error) {
    console.error("Error in handleCustomerSubscriptionUpdated:", error);
    throw error;
  }
}

export async function handleCustomerSubscriptionDeleted(
  event: Stripe.CustomerSubscriptionDeletedEvent
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        stripeCustomerId: String(event.data.object.customer),
      },
    });

    if (!restaurant) {
      throw new Error(
        `Restaurant not found for customer ID: ${event.data.object.customer}`
      );
    }

    const subscription = await prisma.subscription.update({
      where: {
        restaurantId: restaurant.id,
      },
      data: {
        status: "canceled",
        stripeSubscriptionId: event.data.object.id,
        canceledAt: event.data.object.cancel_at
          ? new Date(event.data.object.cancel_at * 1000)
          : new Date(),
      },
    });

    return subscription;
  } catch (error) {
    console.error("Error in handleCustomerSubscriptionDeleted:", error);
    throw error;
  }
}
