-- Add referred_by to profiles
alter table public.profiles
  add column if not exists referred_by uuid references public.profiles(id) on delete set null;

-- Referrals tracking table
create table if not exists public.referrals (
  id uuid default uuid_generate_v4() primary key,
  referrer_id uuid references public.profiles(id) on delete cascade not null,
  referred_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  rewarded boolean not null default false,
  unique (referred_id) -- one referral per new user
);

alter table public.referrals enable row level security;

create policy "Users can view referrals they made"
  on public.referrals for select
  using (auth.uid() = referrer_id);

-- Index for fast referrer lookup
create index referrals_referrer_id_idx on public.referrals(referrer_id);
