-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Deals table
create table public.deals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  brand_name text not null,
  amount numeric(10,2) not null check (amount >= 0),
  currency text not null default 'USD' check (currency in ('USD','EUR','GBP','CAD','AUD')),
  platform text not null check (platform in ('YouTube','Instagram','TikTok','Other')),
  delivery_deadline date not null,
  payment_deadline date not null,
  status text not null default 'negotiating' check (status in ('negotiating','confirmed','delivered','paid')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.deals enable row level security;

create policy "Users can view own deals"
  on public.deals for select
  using (auth.uid() = user_id);

create policy "Users can insert own deals"
  on public.deals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own deals"
  on public.deals for update
  using (auth.uid() = user_id);

create policy "Users can delete own deals"
  on public.deals for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger deals_updated_at
  before update on public.deals
  for each row execute procedure public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes
create index deals_user_id_idx on public.deals(user_id);
create index deals_status_idx on public.deals(status);
create index deals_delivery_deadline_idx on public.deals(delivery_deadline);
create index deals_payment_deadline_idx on public.deals(payment_deadline);
