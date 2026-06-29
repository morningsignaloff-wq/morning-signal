-- User-connected data sources (credentials via service role only)
create table public.user_integrations (
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('stripe')),
  secret_key text not null,
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, provider)
);

create index user_integrations_user_id_idx on public.user_integrations(user_id);

alter table public.user_integrations enable row level security;

-- No client policies: credentials read/written via service role API only
