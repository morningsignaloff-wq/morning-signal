import Stripe from "stripe";

export interface StripeKPIs {
  revenue: number;
  new_customers: number;
  currency: string;
}

export async function fetchStripeKPIs(secretKey: string): Promise<StripeKPIs> {
  const stripe = new Stripe(secretKey);
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

  let revenueCents = 0;
  let currency = "eur";
  let startingAfter: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const page = await stripe.charges.list({
      created: { gte: thirtyDaysAgo },
      limit: 100,
      starting_after: startingAfter,
    });

    for (const charge of page.data) {
      if (charge.paid && !charge.refunded) {
        revenueCents += charge.amount;
        currency = charge.currency;
      }
    }

    hasMore = page.has_more;
    startingAfter = page.data[page.data.length - 1]?.id;
    if (!startingAfter) break;
  }

  const customers = await stripe.customers.list({
    created: { gte: thirtyDaysAgo },
    limit: 100,
  });

  return {
    revenue: Math.round(revenueCents / 100),
    new_customers: customers.data.length,
    currency,
  };
}

export async function validateStripeKey(secretKey: string): Promise<boolean> {
  try {
    const stripe = new Stripe(secretKey);
    await stripe.balance.retrieve();
    return true;
  } catch {
    return false;
  }
}
