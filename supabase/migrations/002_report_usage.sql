-- Monthly report usage for free plan limits
create table public.report_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  month text not null,
  count integer not null default 0,
  primary key (user_id, month)
);

alter table public.report_usage enable row level security;

create policy "Users can view own report usage"
  on public.report_usage for select
  using (auth.uid() = user_id);

create policy "Users can insert own report usage"
  on public.report_usage for insert
  with check (auth.uid() = user_id);

create policy "Users can update own report usage"
  on public.report_usage for update
  using (auth.uid() = user_id);
