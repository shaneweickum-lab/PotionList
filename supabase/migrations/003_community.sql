-- Community System: item requests board and community orders
-- Run this in your Supabase SQL editor after 001_initial.sql and 002_guild.sql

-- Item requests: players post what they need and set a gold bounty
-- Another player can fulfill the request and claim the escrowed gold
create table if not exists public.item_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,
  username     text not null default 'Alchemist',
  item_type    text not null check (item_type in ('herb', 'mushroom', 'seed', 'potion', 'ore', 'ingot')),
  item_id      text not null,
  qty          int  not null check (qty > 0),
  price_each   int  not null check (price_each > 0),
  escrowed_gold int not null check (escrowed_gold > 0),
  is_fulfilled  boolean not null default false,
  fulfilled_by          text,
  fulfilled_by_username text,
  fulfilled_at          timestamptz,
  expires_at   timestamptz not null default (now() + interval '7 days'),
  created_at   timestamptz not null default now()
);

create index if not exists item_requests_active_idx
  on public.item_requests (is_fulfilled, expires_at desc)
  where is_fulfilled = false;

create index if not exists item_requests_user_idx
  on public.item_requests (user_id);

-- Community contributions: per-user contributions toward weekly community orders
-- Aggregated client-side to show collective progress toward each order goal
create table if not exists public.community_contributions (
  id            uuid primary key default gen_random_uuid(),
  order_pool_id text not null,
  week_string   text not null,
  user_id       text not null,
  username      text not null default 'Alchemist',
  qty           int  not null check (qty > 0),
  created_at    timestamptz not null default now()
);

create index if not exists community_contributions_week_idx
  on public.community_contributions (week_string, order_pool_id);

create index if not exists community_contributions_user_idx
  on public.community_contributions (user_id, week_string);

-- Enable Row Level Security
alter table public.item_requests enable row level security;
alter table public.community_contributions enable row level security;

-- RLS Policies

-- item_requests: anyone can view active requests (public board)
create policy "requests_public_read" on public.item_requests
  for select using (true);

-- any player can post a request
create policy "requests_insert" on public.item_requests
  for insert with check (true);

-- owner can cancel (delete) their own request
create policy "requests_owner_delete" on public.item_requests
  for delete using (user_id = (select user_id from public.user_profiles where user_id = current_user limit 1));

-- fulfillment update (mark is_fulfilled, set fulfilled_by etc.)
create policy "requests_fulfill_update" on public.item_requests
  for update using (true);

-- community_contributions: anyone can read (needed for order progress totals)
create policy "contributions_public_read" on public.community_contributions
  for select using (true);

-- any player can contribute
create policy "contributions_insert" on public.community_contributions
  for insert with check (true);
