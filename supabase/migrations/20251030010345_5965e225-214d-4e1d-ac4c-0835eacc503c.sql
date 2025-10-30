-- Enums
create type public.app_role as enum ('admin','moderator','user','seller','verified_shop');

-- Users (mirror auth) + profiles
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  email text
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now()
);

-- Core content
create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  city text,
  state text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.builds (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references public.shops(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null,
  title text not null,
  cover_url text,
  specs jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  build_id uuid not null references public.builds(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, build_id)
);

create table if not exists public.saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  build_id uuid not null references public.builds(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, build_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.builds(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.builds(id) on delete cascade,
  requester_id uuid not null references auth.users(id) on delete cascade,
  details text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz,
  location text,
  created_at timestamptz not null default now()
);

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.shops enable row level security;
alter table public.builds enable row level security;
alter table public.likes enable row level security;
alter table public.saves enable row level security;
alter table public.comments enable row level security;
alter table public.quotes enable row level security;
alter table public.events enable row level security;
alter table public.clubs enable row level security;

-- Basic policies (public read for feed; user-scoped writes)
create policy "profiles_read_all" on public.profiles for select using (true);
create policy "profiles_self_write" on public.profiles for insert with check (auth.uid() = user_id);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = user_id);

create policy "builds_read_all" on public.builds for select using (true);
create policy "builds_author_write" on public.builds for insert with check (auth.uid() = author_id);
create policy "builds_author_update" on public.builds for update using (auth.uid() = author_id);

create policy "likes_read_all" on public.likes for select using (true);
create policy "likes_self_write" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_self_delete" on public.likes for delete using (auth.uid() = user_id);

create policy "saves_read_all" on public.saves for select using (true);
create policy "saves_self_write" on public.saves for insert with check (auth.uid() = user_id);
create policy "saves_self_delete" on public.saves for delete using (auth.uid() = user_id);

create policy "comments_read_all" on public.comments for select using (true);
create policy "comments_self_write" on public.comments for insert with check (auth.uid() = author_id);
create policy "comments_self_update" on public.comments for update using (auth.uid() = author_id);
create policy "comments_self_delete" on public.comments for delete using (auth.uid() = author_id);

create policy "quotes_read_own_or_shop" on public.quotes for select using ( true );
create policy "quotes_self_write" on public.quotes for insert with check (auth.uid() = requester_id);

create policy "events_read_all" on public.events for select using (true);
create policy "clubs_read_all" on public.clubs for select using (true);