import { STRIPE_SECRET_KEY } from "$env/static/private";
import Stripe from "stripe";

export function createStripeClient() {
  return new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}
