-- Minimal schema for the AI Spend Audit MVP.
-- Run in your Supabase SQL editor (or as a migration).

create extension if not exists pgcrypto;

create table if not exists public.audit_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Selected tool(s) for the audit. MVP stores one tool, but keeps array shape for future.
  tools text[] not null,

  -- AI recommendations and computed savings output.
  recommendations jsonb not null,
  monthly_savings double precision not null,
  annual_savings double precision not null,
  current_monthly_cost double precision not null,
  optimized_monthly_cost double precision not null,
  average_confidence real not null,

  -- Used to generate (and then persist) the ~100-word AI summary.
  use_case text not null,
  ai_summary text not null,

  -- Lead capture (stored after results are shown).
  email text,
  company_name text,
  role text,

  -- Public share ID used in `/audit/[id]` pages.
  public_share_id text not null unique
);

create index if not exists audit_submissions_public_share_id_idx
  on public.audit_submissions (public_share_id);

