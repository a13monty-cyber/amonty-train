-- ============================================================================
-- MONTY · Dashboard schema
-- Run this once in your Supabase project: SQL Editor -> New query -> paste ->
-- Run. It creates the trainees + plans tables and locks each row to the coach
-- who owns it (Row Level Security), so coaches only ever see their own data.
-- ============================================================================

-- ---- trainees (a "folder" per athlete) ----
create table if not exists public.trainees (
  id         uuid primary key default gen_random_uuid(),
  coach_id   uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  sport      text default '',
  age        text default '',
  notes      text default '',
  created_at timestamptz not null default now()
);

-- ---- plans (many per trainee) ----
-- The full plan document is stored as JSON in `data`, matching the generator's
-- Plan shape, so the exact format is preserved verbatim.
create table if not exists public.plans (
  id         uuid primary key default gen_random_uuid(),
  coach_id   uuid not null references auth.users (id) on delete cascade,
  trainee_id uuid not null references public.trainees (id) on delete cascade,
  title      text not null default '',
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plans_trainee_idx on public.plans (trainee_id);
create index if not exists trainees_coach_idx on public.trainees (coach_id);

-- ---- Row Level Security ----
alter table public.trainees enable row level security;
alter table public.plans    enable row level security;

-- trainees: a coach may read/write only their own rows
drop policy if exists trainees_own on public.trainees;
create policy trainees_own on public.trainees
  for all
  using (auth.uid() = coach_id)
  with check (auth.uid() = coach_id);

-- plans: same rule
drop policy if exists plans_own on public.plans;
create policy plans_own on public.plans
  for all
  using (auth.uid() = coach_id)
  with check (auth.uid() = coach_id);
