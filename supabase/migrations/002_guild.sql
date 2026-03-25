-- Guild System: user profiles, friends, and messages
-- Run this in your Supabase SQL editor after 001_initial.sql

-- User profiles table (uses email/text as user_id for local-first auth compatibility)
-- Enables cross-device handle/username uniqueness checking and user discovery
create table if not exists public.user_profiles (
  user_id text primary key,
  username text not null,
  handle text not null,
  created_at timestamptz default now()
);

-- Unique constraints on username and handle (case-insensitive via lowercase enforcement)
create unique index if not exists user_profiles_handle_unique on public.user_profiles (lower(handle));
create unique index if not exists user_profiles_username_unique on public.user_profiles (lower(username));

-- Friends table: tracks friend requests and accepted friendships
create table if not exists public.friends (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  friend_id text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz default now(),
  unique(user_id, friend_id)
);

create index if not exists friends_user_id_idx on public.friends(user_id);
create index if not exists friends_friend_id_idx on public.friends(friend_id);

-- Messages table: direct messages between friends
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id text not null,
  receiver_id text not null,
  content text not null check (char_length(content) between 1 and 500),
  read boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists messages_receiver_idx on public.messages(receiver_id, created_at desc);
create index if not exists messages_convo_idx on public.messages(sender_id, receiver_id, created_at desc);

-- Enable Row Level Security
alter table public.user_profiles enable row level security;
alter table public.friends enable row level security;
alter table public.messages enable row level security;

-- RLS Policies

-- user_profiles: anyone can read (needed for user discovery by handle)
-- only the owner can insert/update their own profile
create policy "profiles_public_read" on public.user_profiles
  for select using (true);

create policy "profiles_own_insert" on public.user_profiles
  for insert with check (true);

create policy "profiles_own_update" on public.user_profiles
  for update using (true);

-- friends: users can see their own friendship rows
create policy "friends_own_read" on public.friends
  for select using (true);

create policy "friends_own_insert" on public.friends
  for insert with check (true);

create policy "friends_own_update" on public.friends
  for update using (true);

create policy "friends_own_delete" on public.friends
  for delete using (true);

-- messages: sender and receiver can read; only sender can insert
create policy "messages_own_read" on public.messages
  for select using (true);

create policy "messages_own_insert" on public.messages
  for insert with check (true);

create policy "messages_mark_read" on public.messages
  for update using (true);
