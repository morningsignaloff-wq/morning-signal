-- Morning priority insights (3–5 signals per report)
alter table public.reports
  add column if not exists priority_insights jsonb not null default '[]'::jsonb;
