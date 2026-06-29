-- Monthly report usage for free plan limits
create table if not exists public.report_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  month text not null,
  count integer not null default 0,
  primary key (user_id, month)
);

alter table public.report_usage enable row level security;

drop policy if exists "Users can view own report usage" on public.report_usage;
create policy "Users can view own report usage"
  on public.report_usage for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own report usage" on public.report_usage;
create policy "Users can insert own report usage"
  on public.report_usage for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own report usage" on public.report_usage;
create policy "Users can update own report usage"
  on public.report_usage for update
  using (auth.uid() = user_id);
