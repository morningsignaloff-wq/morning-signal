import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function isProStatus(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}
