-- Expand user_profiles with full profile data and public game stats
--
-- Previously only username and handle were stored (enough for friend
-- discovery). This adds the remaining profile fields and public stats
-- so other players can view complete profiles.

alter table public.user_profiles
  add column if not exists nickname     text,
  add column if not exists bio          text check (char_length(bio) <= 160),
  add column if not exists avatar_url   text,
  add column if not exists level        int  not null default 1 check (level >= 1),
  add column if not exists streak       int  not null default 0,
  add column if not exists longest_streak int not null default 0,
  add column if not exists tasks_completed  int not null default 0,
  add column if not exists potions_brewed   int not null default 0,
  add column if not exists founder      boolean not null default false,
  add column if not exists updated_at   timestamptz not null default now();

-- Auto-update updated_at on every profile write
create or replace function update_user_profiles_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function update_user_profiles_updated_at();
