-- Stripe subscription state per user
create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  status text not null default 'inactive',
  plan text not null default 'free',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_stripe_customer_id_idx on public.subscriptions(stripe_customer_id);
create index subscriptions_stripe_subscription_id_idx on public.subscriptions(stripe_subscription_id);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);
