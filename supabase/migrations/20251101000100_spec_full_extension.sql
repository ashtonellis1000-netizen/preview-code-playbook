-- SPEC extended schema for messaging, mod lists, vehicle data, notifications, and payments

-- Enums
create type if not exists public.quote_status as enum ('pending','in_progress','accepted','declined','completed');
create type if not exists public.notification_type as enum (
  'like',
  'comment',
  'save',
  'message',
  'quote_update',
  'build_update',
  'system'
);
create type if not exists public.message_participant_role as enum ('customer','shop','admin');
create type if not exists public.media_owner_type as enum ('build','build_update','profile','shop');

-- Vehicle catalog
create table if not exists public.vehicle_makes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists public.vehicle_models (
  id uuid primary key default gen_random_uuid(),
  make_id uuid not null references public.vehicle_makes(id) on delete cascade,
  name text not null,
  unique(make_id, name)
);

create table if not exists public.vehicle_trims (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.vehicle_models(id) on delete cascade,
  year int,
  trim_name text,
  engine text,
  transmission text,
  drivetrain text,
  base_msrp numeric,
  unique(model_id, year, trim_name)
);

alter table public.builds
  add column if not exists vehicle_trim_id uuid references public.vehicle_trims(id) on delete set null,
  add column if not exists published_at timestamptz,
  add column if not exists status text default 'draft';

create table if not exists public.build_vehicle_specs (
  build_id uuid primary key references public.builds(id) on delete cascade,
  vin text,
  exterior_color text,
  interior_color text,
  mileage int,
  acquisition_source text,
  asking_price numeric,
  condition_notes text
);

-- Build stages + mod lists
create table if not exists public.build_stages (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.builds(id) on delete cascade,
  position int not null default 0,
  title text not null,
  description text,
  media_asset_id uuid,
  occurred_at timestamptz
);

create table if not exists public.mod_lists (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.builds(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.mod_list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.mod_lists(id) on delete cascade,
  part_name text not null,
  manufacturer text,
  part_number text,
  category text,
  cost numeric,
  status text default 'planned',
  created_at timestamptz not null default now()
);

create table if not exists public.build_updates (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.builds(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete set null,
  title text,
  body text,
  progress_percent int,
  media_asset_id uuid,
  created_at timestamptz not null default now()
);

-- Media storage metadata
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null,
  path text not null,
  owner_id uuid references auth.users(id) on delete set null,
  owner_type public.media_owner_type not null,
  created_at timestamptz not null default now(),
  metadata jsonb
);

-- Messaging + quotes extension
create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  build_id uuid references public.builds(id) on delete set null,
  shop_id uuid references public.shops(id) on delete set null,
  customer_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  last_message_at timestamptz
);

create table if not exists public.thread_participants (
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.message_participant_role not null default 'customer',
  joined_at timestamptz not null default now(),
  primary key (thread_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text,
  media_asset_id uuid,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

alter table public.quotes
  add column if not exists shop_id uuid references public.shops(id) on delete set null,
  add column if not exists thread_id uuid references public.message_threads(id) on delete set null,
  add column if not exists estimated_total numeric,
  add column if not exists expires_at timestamptz,
  alter column status type public.quote_status using status::public.quote_status,
  alter column status set default 'pending';

create table if not exists public.quote_messages (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.notification_type not null,
  actor_id uuid references auth.users(id) on delete set null,
  build_id uuid references public.builds(id) on delete set null,
  quote_id uuid references public.quotes(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  payload jsonb
);

-- Shop verification workflow
create table if not exists public.shop_verification_requests (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  submitted_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  reviewer_id uuid references auth.users(id) on delete set null,
  notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- Stripe monetisation metadata
create table if not exists public.stripe_accounts (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  account_id text not null,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.stripe_prices (
  id uuid primary key default gen_random_uuid(),
  build_id uuid references public.builds(id) on delete cascade,
  price_id text not null,
  currency text not null default 'usd',
  unit_amount int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references public.quotes(id) on delete set null,
  payer_id uuid references auth.users(id) on delete set null,
  amount int not null,
  currency text not null default 'usd',
  status text not null,
  stripe_payment_intent text,
  created_at timestamptz not null default now()
);

create table if not exists public.stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(event_id)
);

-- RLS
alter table public.vehicle_makes enable row level security;
alter table public.vehicle_models enable row level security;
alter table public.vehicle_trims enable row level security;
alter table public.build_vehicle_specs enable row level security;
alter table public.build_stages enable row level security;
alter table public.mod_lists enable row level security;
alter table public.mod_list_items enable row level security;
alter table public.build_updates enable row level security;
alter table public.media_assets enable row level security;
alter table public.message_threads enable row level security;
alter table public.thread_participants enable row level security;
alter table public.messages enable row level security;
alter table public.quote_messages enable row level security;
alter table public.notifications enable row level security;
alter table public.shop_verification_requests enable row level security;
alter table public.stripe_accounts enable row level security;
alter table public.stripe_prices enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.stripe_webhook_events enable row level security;

-- Basic policies
create policy if not exists "vehicle_catalog_read" on public.vehicle_makes for select using (true);
create policy if not exists "vehicle_catalog_read_models" on public.vehicle_models for select using (true);
create policy if not exists "vehicle_catalog_read_trims" on public.vehicle_trims for select using (true);

create policy if not exists "build_specs_owner_access" on public.build_vehicle_specs for select using (true);
create policy if not exists "build_specs_owner_write" on public.build_vehicle_specs for insert with check (auth.uid() = (select author_id from public.builds where id = build_id));
create policy if not exists "build_specs_owner_update" on public.build_vehicle_specs for update using (auth.uid() = (select author_id from public.builds where id = build_id));

create policy if not exists "build_stages_read" on public.build_stages for select using (true);
create policy if not exists "build_stages_owner_write" on public.build_stages for insert with check (auth.uid() = (select author_id from public.builds where id = build_id));
create policy if not exists "build_stages_owner_update" on public.build_stages for update using (auth.uid() = (select author_id from public.builds where id = build_id));
create policy if not exists "build_stages_owner_delete" on public.build_stages for delete using (auth.uid() = (select author_id from public.builds where id = build_id));

create policy if not exists "mod_lists_read" on public.mod_lists for select using (true);
create policy if not exists "mod_lists_owner_write" on public.mod_lists for insert with check (auth.uid() = (select author_id from public.builds where id = build_id));
create policy if not exists "mod_lists_owner_update" on public.mod_lists for update using (auth.uid() = (select author_id from public.builds where id = build_id));
create policy if not exists "mod_lists_owner_delete" on public.mod_lists for delete using (auth.uid() = (select author_id from public.builds where id = build_id));

create policy if not exists "mod_items_read" on public.mod_list_items for select using (true);
create policy if not exists "mod_items_owner_write" on public.mod_list_items for insert with check (auth.uid() = (select author_id from public.builds where id = (select build_id from public.mod_lists where id = list_id)));
create policy if not exists "mod_items_owner_update" on public.mod_list_items for update using (auth.uid() = (select author_id from public.builds where id = (select build_id from public.mod_lists where id = list_id)));
create policy if not exists "mod_items_owner_delete" on public.mod_list_items for delete using (auth.uid() = (select author_id from public.builds where id = (select build_id from public.mod_lists where id = list_id)));

create policy if not exists "build_updates_read" on public.build_updates for select using (true);
create policy if not exists "build_updates_owner_write" on public.build_updates for insert with check (auth.uid() = author_id);
create policy if not exists "build_updates_owner_update" on public.build_updates for update using (auth.uid() = author_id);
create policy if not exists "build_updates_owner_delete" on public.build_updates for delete using (auth.uid() = author_id);

create policy if not exists "media_assets_read" on public.media_assets for select using (true);
create policy if not exists "media_assets_owner_write" on public.media_assets for insert with check (auth.uid() = owner_id);
create policy if not exists "media_assets_owner_update" on public.media_assets for update using (auth.uid() = owner_id);

create policy if not exists "threads_select" on public.message_threads for select using (
  auth.uid() = customer_id or auth.uid() = (select owner_id from public.shops where id = shop_id)
);
create policy if not exists "threads_insert" on public.message_threads for insert with check (auth.uid() = customer_id or auth.uid() = (select owner_id from public.shops where id = shop_id));

create policy if not exists "thread_participants_read" on public.thread_participants for select using (
  auth.uid() = user_id
);
create policy if not exists "thread_participants_insert" on public.thread_participants for insert with check (
  auth.uid() = user_id
);

create policy if not exists "messages_read" on public.messages for select using (
  auth.uid() in (select user_id from public.thread_participants where thread_id = messages.thread_id)
);
create policy if not exists "messages_insert" on public.messages for insert with check (
  auth.uid() = sender_id and auth.uid() in (select user_id from public.thread_participants where thread_id = messages.thread_id)
);

create policy if not exists "quote_messages_read" on public.quote_messages for select using (
  auth.uid() = (select requester_id from public.quotes where id = quote_id)
  or auth.uid() = (
    select owner_id
    from public.shops
    where id = (select shop_id from public.quotes where id = quote_id)
  )
);
create policy if not exists "quote_messages_insert" on public.quote_messages for insert with check (
  auth.uid() = author_id
);

create policy if not exists "notifications_read" on public.notifications for select using (auth.uid() = user_id);
create policy if not exists "notifications_update" on public.notifications for update using (auth.uid() = user_id);

create policy if not exists "shop_verification_read" on public.shop_verification_requests for select using (
  auth.uid() = submitted_by or auth.role() = 'service_role'
);
create policy if not exists "shop_verification_write" on public.shop_verification_requests for insert with check (auth.uid() = submitted_by);

create policy if not exists "stripe_accounts_read" on public.stripe_accounts for select using (
  auth.uid() = (select owner_id from public.shops where id = shop_id)
);
create policy if not exists "stripe_prices_read" on public.stripe_prices for select using (true);
create policy if not exists "payment_transactions_read" on public.payment_transactions for select using (
  auth.uid() = payer_id or auth.uid() = (select owner_id from public.shops where id = (select shop_id from public.quotes where id = payment_transactions.quote_id))
);
create policy if not exists "stripe_webhook_events_read" on public.stripe_webhook_events for select using (auth.role() = 'service_role');

