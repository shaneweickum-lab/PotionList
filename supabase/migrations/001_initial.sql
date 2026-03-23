-- PotionList Database Schema
-- Run this in your Supabase SQL editor

-- Users table (mirrors auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  created_at timestamptz default now()
);

-- Save data table
create table if not exists public.saves (
  user_id uuid primary key references public.users(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Market listings
create table if not exists public.market_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  item_type text not null check (item_type in ('potion', 'herb', 'mushroom', 'ore', 'ingot', 'bug')),
  item_id text not null,
  qty int not null check (qty > 0),
  price int not null check (price > 0),
  listed_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '48 hours')
);

-- IAP receipts
create table if not exists public.iap_receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  product_id text not null,
  receipt_data jsonb,
  validated_at timestamptz default now()
);

-- Push subscriptions
create table if not exists public.push_subscriptions (
  user_id uuid references public.users(id) on delete cascade,
  endpoint text primary key,
  subscription jsonb not null,
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.saves enable row level security;
alter table public.market_listings enable row level security;
alter table public.iap_receipts enable row level security;
alter table public.push_subscriptions enable row level security;

-- RLS Policies

-- Users: can read/update their own row
create policy "users_own_profile" on public.users
  using (id = auth.uid())
  with check (id = auth.uid());

-- Saves: full access to own save
create policy "saves_own_data" on public.saves
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Market: anyone can view, owner can insert/delete
create policy "market_public_read" on public.market_listings
  for select using (expires_at > now());

create policy "market_owner_insert" on public.market_listings
  for insert with check (user_id = auth.uid());

create policy "market_owner_delete" on public.market_listings
  for delete using (user_id = auth.uid());

-- IAP receipts: owner can insert and read own
create policy "iap_owner_access" on public.iap_receipts
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Push subscriptions: owner only
create policy "push_owner_access" on public.push_subscriptions
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Index for market expiry cleanup
create index if not exists market_expires_at_idx on public.market_listings(expires_at);

-- Auto-update updated_at for saves
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger saves_updated_at
  before update on public.saves
  for each row execute function update_updated_at();

-- Create user profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
