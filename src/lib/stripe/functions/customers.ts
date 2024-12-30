import { createStripeClient } from "../stripe-client";

export function createStripeCustomer(email: string) {
  const stripe = createStripeClient();
  return stripe.customers.create({ email });
}
