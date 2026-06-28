-- KPI entries submitted by users
create table public.kpi_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  revenue numeric not null,
  new_users integer not null,
  conversion_rate numeric not null,
  ad_spend numeric not null,
  notes text,
  created_at timestamptz not null default now()
);

-- AI-generated reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kpi_entry_id uuid not null references public.kpi_entries(id) on delete cascade,
  business_overview text not null,
  key_trends text not null,
  risks_alerts text not null,
  opportunities text not null,
  daily_actions jsonb not null,
  created_at timestamptz not null default now()
);

create index kpi_entries_user_id_idx on public.kpi_entries(user_id);
create index kpi_entries_created_at_idx on public.kpi_entries(created_at desc);
create index reports_user_id_idx on public.reports(user_id);
create index reports_created_at_idx on public.reports(created_at desc);

alter table public.kpi_entries enable row level security;
alter table public.reports enable row level security;

create policy "Users can view own kpi entries"
  on public.kpi_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own kpi entries"
  on public.kpi_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can view own reports"
  on public.reports for select
  using (auth.uid() = user_id);

create policy "Users can insert own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

-- Service role needs access for cron job (bypasses RLS when using service key)
