-- Fix market_listings and saves to work with local-first auth
--
-- The app uses email strings as userId (local-first, no Supabase auth).
-- The original schema used uuid FKs to auth.users which breaks all writes
-- from the client. This migration converts those columns to text and
-- replaces auth.uid()-based RLS policies with permissive ones (app logic
-- enforces ownership at the call-site level).
--
-- Run this in your Supabase SQL editor after 001_initial.sql

-- ── saves ──────────────────────────────────────────────────────────────────────

alter table public.saves drop constraint if exists saves_user_id_fkey;
alter table public.saves alter column user_id type text using user_id::text;

drop policy if exists "saves_own_data" on public.saves;

create policy "saves_read" on public.saves
  for select using (true);

create policy "saves_insert" on public.saves
  for insert with check (true);

create policy "saves_update" on public.saves
  for update using (true);

-- ── market_listings ────────────────────────────────────────────────────────────

alter table public.market_listings drop constraint if exists market_listings_user_id_fkey;
alter table public.market_listings alter column user_id type text using user_id::text;

-- Add username so listings display seller name without a join
alter table public.market_listings
  add column if not exists username text not null default 'Alchemist';

-- Add seed to the allowed item types (the UI already offers it)
alter table public.market_listings
  drop constraint if exists market_listings_item_type_check;

alter table public.market_listings
  add constraint market_listings_item_type_check
  check (item_type in ('potion', 'herb', 'mushroom', 'ore', 'ingot', 'bug', 'seed'));

-- Replace auth.uid()-based policies with permissive ones.
-- Buyers need DELETE permission too (buying removes the listing), so both
-- insert and delete are open; the application enforces ownership logic.
drop policy if exists "market_owner_insert" on public.market_listings;
drop policy if exists "market_owner_delete" on public.market_listings;

create policy "market_insert" on public.market_listings
  for insert with check (true);

create policy "market_delete" on public.market_listings
  for delete using (true);
