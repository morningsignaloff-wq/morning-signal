import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isProStatus } from "@/lib/stripe";
import type { PlanId } from "@/lib/plans";
import { canAccessConnector, getConnectorLimit } from "@/lib/plans";

export type SubscriptionRecord = {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: string;
  plan: string;
  current_period_end: string | null;
};

export async function getUserSubscription(
  userId: string
): Promise<SubscriptionRecord | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return data as SubscriptionRecord | null;
}

export async function getUserPlan(userId: string): Promise<PlanId> {
  const sub = await getUserSubscription(userId);
  if (!sub || !isProStatus(sub.status)) return "free";
  if (sub.plan === "growth") return "growth";
  return "pro";
}

export async function isPaidUser(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === "pro" || plan === "growth";
}

/** @deprecated use isPaidUser */
export async function isUserPro(userId: string): Promise<boolean> {
  return isPaidUser(userId);
}

export async function getConnectedIntegrations(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("user_integrations")
    .select("provider, connected_at")
    .eq("user_id", userId);

  return data ?? [];
}

export async function userCanUseConnector(
  userId: string,
  connectorId: string
): Promise<boolean> {
  const plan = await getUserPlan(userId);
  if (!canAccessConnector(plan, connectorId)) return false;

  const limit = getConnectorLimit(plan);
  if (limit === 0) return false;
  if (limit === null) return true;

  const connected = await getConnectedIntegrations(userId);
  if (connected.length === 0) return true;
  return connected.some((c) => c.provider === connectorId);
}

export async function upsertSubscription(record: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string | null;
  status: string;
  plan?: PlanId;
  currentPeriodEnd?: Date | null;
}) {
  const supabase = createAdminClient();
  const active = isProStatus(record.status);
  const plan: PlanId = active ? (record.plan ?? "pro") : "free";

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: record.userId,
      stripe_customer_id: record.stripeCustomerId,
      stripe_subscription_id: record.stripeSubscriptionId ?? null,
      status: record.status,
      plan,
      current_period_end: record.currentPeriodEnd?.toISOString() ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function getStripeIntegration(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("user_integrations")
    .select("provider, connected_at")
    .eq("user_id", userId)
    .eq("provider", "stripe")
    .maybeSingle();

  return data;
}

export async function getStripeSecretKey(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("user_integrations")
    .select("secret_key")
    .eq("user_id", userId)
    .eq("provider", "stripe")
    .maybeSingle();

  return data?.secret_key ?? null;
}

export async function saveStripeIntegration(userId: string, secretKey: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("user_integrations").upsert(
    {
      user_id: userId,
      provider: "stripe",
      secret_key: secretKey,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,provider" }
  );

  if (error) throw new Error(error.message);
}

export async function removeStripeIntegration(userId: string) {
  const admin = createAdminClient();
  await admin
    .from("user_integrations")
    .delete()
    .eq("user_id", userId)
    .eq("provider", "stripe");
}
