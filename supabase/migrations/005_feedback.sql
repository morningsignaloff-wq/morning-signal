-- User feedback from landing page
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

create index feedback_created_at_idx on public.feedback(created_at desc);

alter table public.feedback enable row level security;

-- No public policies: inserts via service role API only
