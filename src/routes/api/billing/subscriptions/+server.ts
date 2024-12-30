import {
  handleCustomerSubscriptionCreated,
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

//   async verifyStripeSignature(
//     payload: Buffer,
//     signature: string
//   ): Promise<Stripe.Event> {
//     try {
//       return this.stripe.webhooks.constructEvent(
//         payload,
//         signature,
//         STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error("⚠️ Webhook signature verification failed:", err);
//       throw error(400, "Invalid webhook signature");
//     }
//   }

//   private async handleInvoicePaid(
//     event: Stripe.Event
//   ): Promise<WebhookHandlerResponse> {
//     console.log("🔔 Processing invoice.paid event:", {
//       eventId: event.id,
//       invoice: (event.data.object as Stripe.Invoice).id,
//       customer: (event.data.object as Stripe.Invoice).customer,
//     });

//     const invoice = event.data.object as Stripe.Invoice;

//     console.log("HEY! LISTEN!", invoice);
//     const restaurantId = invoice.subscription_details?.metadata?.restaurantId;

//     if (!restaurantId) {
//       return { success: false, message: "No restaurant ID in metadata" };
//     }

//     try {
//       await prisma.$transaction(async (tx) => {
//         const restaurant = await tx.restaurant.findUnique({
//           where: { id: parseInt(restaurantId) },
//         });

//         if (!restaurant) {
//           throw new Error(`Restaurant not found: ${restaurantId}`);
//         }

//         await tx.restaurant.update({
//           where: { id: restaurant.id },
//           data: { active: true },
//         });

//         const subscriptionData = {
//           status: "ACTIVE" as SubscriptionStatus,
//           stripeSubscriptionId: invoice.subscription as string,
//           stripeCustomerId: invoice.customer as string,
//           currentPeriodStart: new Date(invoice.period_start * 1000),
//           currentPeriodEnd: new Date(invoice.period_end * 1000),
//         };

//         await tx.subscription.upsert({
//           where: { restaurantId: restaurant.id },
//           update: subscriptionData,
//           create: {
//             ...subscriptionData,
//             restaurantId: restaurant.id,
//           },
//         });
//       });

//       return { success: true };
//     } catch (err) {
//       console.error("Failed to process invoice.paid:", err);
//       throw error(500, "Failed to process payment");
//     }
//   }

//   private async handleInvoicePaymentFailed(
//     event: Stripe.Event
//   ): Promise<WebhookHandlerResponse> {
//     console.log("⚠️ Processing invoice.payment_failed event:", {
//       eventId: event.id,
//       invoice: (event.data.object as Stripe.Invoice).id,
//       customer: (event.data.object as Stripe.Invoice).customer,
//     });

//     const invoice = event.data.object as Stripe.Invoice;
//     const restaurantId = invoice.subscription_details?.metadata?.restaurantId;

//     if (!restaurantId) {
//       return { success: false, message: "No restaurant ID in metadata" };
//     }

//     try {
//       await prisma.$transaction(async (tx) => {
//         const restaurant = await tx.restaurant.findUnique({
//           where: { id: parseInt(restaurantId) },
//         });

//         if (!restaurant) {
//           throw new Error(`Restaurant not found: ${restaurantId}`);
//         }

//         await tx.restaurant.update({
//           where: { id: restaurant.id },
//           data: { active: false },
//         });

//         await tx.subscription.update({
//           where: { restaurantId: restaurant.id },
//           data: {
//             status: "PAST_DUE",
//             currentPeriodEnd: new Date(invoice.period_end * 1000),
//           },
//         });
//       });

//       return { success: true };
//     } catch (err) {
//       console.error("Failed to process invoice.payment_failed:", err);
//       throw error(500, "Failed to process payment failure");
//     }
//   }

//   private async handleSubscriptionCreated(
//     event: Stripe.Event
//   ): Promise<WebhookHandlerResponse> {
//     console.log("✨ Processing subscription.created event:", {
//       eventId: event.id,
//       subscription: (event.data.object as Stripe.Subscription).id,
//       customer: (event.data.object as Stripe.Subscription).customer,
//     });

//     const subscription = event.data.object as Stripe.Subscription;
//     const restaurantId = subscription.metadata?.restaurantId;

//     if (!restaurantId) {
//       return { success: false, message: "No restaurant ID in metadata" };
//     }

//     try {
//       await prisma.$transaction(async (tx) => {
//         const restaurant = await tx.restaurant.findUnique({
//           where: { id: parseInt(restaurantId) },
//         });

//         if (!restaurant) {
//           throw new Error(`Restaurant not found: ${restaurantId}`);
//         }

//         await tx.subscription.create({
//           data: {
//             restaurantId: restaurant.id,
//             status: "ACTIVE",
//             stripeSubscriptionId: subscription.id,
//             stripeCustomerId: subscription.customer as string,
//             currentPeriodStart: new Date(
//               subscription.current_period_start * 1000
//             ),
//             currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//           },
//         });
//       });

//       return { success: true };
//     } catch (err) {
//       console.error("Failed to process subscription.created:", err);
//       throw error(500, "Failed to process subscription creation");
//     }
//   }

//   private async handleSubscriptionUpdated(
//     event: Stripe.Event
//   ): Promise<WebhookHandlerResponse> {
//     console.log("📝 Processing subscription.updated event:", {
//       eventId: event.id,
//       subscription: (event.data.object as Stripe.Subscription).id,
//       customer: (event.data.object as Stripe.Subscription).customer,
//       newStatus: (event.data.object as Stripe.Subscription).status,
//     });

//     const subscription = event.data.object as Stripe.Subscription;
//     const restaurantId = subscription.metadata?.restaurantId;

//     if (!restaurantId) {
//       return { success: false, message: "No restaurant ID in metadata" };
//     }

//     try {
//       await prisma.subscription.update({
//         where: {
//           stripeSubscriptionId: subscription.id,
//         },
//         data: {
//           status: subscription.status === "active" ? "ACTIVE" : "PAST_DUE",
//           currentPeriodStart: new Date(
//             subscription.current_period_start * 1000
//           ),
//           currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//         },
//       });

//       return { success: true };
//     } catch (err) {
//       console.error("Failed to process subscription.updated:", err);
//       throw error(500, "Failed to process subscription update");
//     }
//   }

//   private async handleSubscriptionDeleted(
//     event: Stripe.Event
//   ): Promise<WebhookHandlerResponse> {
//     console.log("🗑️ Processing subscription.deleted event:", {
//       eventId: event.id,
//       subscription: (event.data.object as Stripe.Subscription).id,
//       customer: (event.data.object as Stripe.Subscription).customer,
//     });

//     const subscription = event.data.object as Stripe.Subscription;
//     const restaurantId = subscription.metadata?.restaurantId;

//     if (!restaurantId) {
//       return { success: false, message: "No restaurant ID in metadata" };
//     }

//     try {
//       await prisma.$transaction(async (tx) => {
//         const restaurant = await tx.restaurant.findUnique({
//           where: { id: parseInt(restaurantId) },
//         });

//         if (!restaurant) {
//           throw new Error(`Restaurant not found: ${restaurantId}`);
//         }

//         await tx.restaurant.update({
//           where: { id: restaurant.id },
//           data: { active: false },
//         });

//         await tx.subscription.update({
//           where: { stripeSubscriptionId: subscription.id },
//           data: {
//             status: "CANCELED",
//             canceledAt: new Date(),
//           },
//         });
//       });

//       return { success: true };
//     } catch (err) {
//       console.error("Failed to process subscription.deleted:", err);
//       throw error(500, "Failed to process subscription deletion");
//     }
//   }

//   private async handlePaymentMethodAttached(
//     event: Stripe.Event
//   ): Promise<WebhookHandlerResponse> {
//     console.log("💳 Processing payment_method.attached event:", {
//       eventId: event.id,
//       paymentMethod: (event.data.object as Stripe.PaymentMethod).id,
//       customer: (event.data.object as Stripe.PaymentMethod).customer,
//     });

//     const paymentMethod = event.data.object as Stripe.PaymentMethod;
//     const customerId = paymentMethod.customer as string;

//     try {
//       await this.stripe.customers.update(customerId, {
//         invoice_settings: {
//           default_payment_method: paymentMethod.id,
//         },
//       });

//       return { success: true };
//     } catch (err) {
//       console.error("Failed to process payment_method.attached:", err);
//       throw error(500, "Failed to process payment method attachment");
//     }
//   }

//   private async handleCustomerDeleted(
//     event: Stripe.Event
//   ): Promise<WebhookHandlerResponse> {
//     console.log("👤 Processing customer.deleted event:", {
//       eventId: event.id,
//       customer: (event.data.object as Stripe.Customer).id,
//     });

//     const customer = event.data.object as Stripe.Customer;

//     try {
//       await prisma.subscription.updateMany({
//         where: { stripeCustomerId: customer.id },
//         data: {
//           status: "CANCELED",
//           canceledAt: new Date(),
//         },
//       });

//       return { success: true };
//     } catch (err) {
//       console.error("Failed to process customer.deleted:", err);
//       throw error(500, "Failed to process customer deletion");
//     }
//   }

//   async handleWebhook(
//     rawBody: ArrayBuffer,
//     signature: string
//   ): Promise<WebhookHandlerResponse> {
//     console.log("📥 Received webhook request");

//     const payload = this.arrayBufferToBuffer(rawBody);
//     console.log("📦 Converted payload to buffer");

//     const event = await this.verifyStripeSignature(payload, signature);
//     console.log("✅ Verified Stripe signature for event:", event.type);

//     switch (event.type) {
//       case "invoice.paid":
//         return this.handleInvoicePaid(event);

//       case "invoice.payment_failed":
//         return this.handleInvoicePaymentFailed(event);

//       case "customer.subscription.created":
//         return this.handleSubscriptionCreated(event);

//       case "customer.subscription.updated":
//         return this.handleSubscriptionUpdated(event);

//       case "customer.subscription.deleted":
//         return this.handleSubscriptionDeleted(event);

//       case "payment_method.attached":
//         return this.handlePaymentMethodAttached(event);

//       case "customer.deleted":
//         return this.handleCustomerDeleted(event);

//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//         return {
//           success: true,
//           message: `Unhandled event type: ${event.type}`,
//         };export function createStripeSubscriptionCheckoutSession(restaurantId: string) {
//     }
//   }
// }

// export const POST: RequestHandler = async ({ request }) => {
//   console.log("🎯 Webhook endpoint hit");

//   const signature = request.headers.get("stripe-signature");
//   if (!signature) {
//     console.error("❌ Missing stripe-signature header");
//     throw error(400, "Missing stripe-signature header");
//   }

//   const webhookHandler = new WebhookHandler();
//   const rawBody = await request.arrayBuffer();

//   try {
//     const result = await webhookHandler.handleWebhook(rawBody, signature);
//     console.log("✅ Successfully processed webhook:", result);
//     return json(result);
//   } catch (err: any) {
//     console.error("❌ Webhook processing failed:", {
//       error: err,
//       message: err.message,
//       status: err.status,
//     });
//     throw error(err.status || 500, err.message || "Internal server error");
//   }
// };

export const GET: RequestHandler = async ({ request, url }) => {
  const subscriptionTier = url.searchParams.get("subscriptionTier");
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!subscriptionTier || !["Basic", "Elite"].includes(subscriptionTier)) {
    return json({ error: "Invalid subscriptionTier" }, { status: 400 });
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
    subscriptionTier as "Basic" | "Elite"
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
    default:
      console.log(`Unhandled event type: ${event.type}`);
      return json(
        { error: `Unhandled event type: ${event.type}` },
        { status: 400 }
      );
  }

  return json({ message: "Webhook processed successfully" }, { status: 200 });
};
