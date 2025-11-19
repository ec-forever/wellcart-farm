-- Supabase schema for Wellcart Farm
-- Creates retailer and product catalog tables, disables RLS, and seeds public storage buckets.

create extension if not exists "uuid-ossp";

create table if not exists public.retailer_profiles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contact_email text,
  contact_phone text,
  onboarding_status text default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.retailer_profiles disable row level security;

create table if not exists public.product_catalog_items (
  id uuid primary key default uuid_generate_v4(),
  retailer_id uuid references public.retailer_profiles(id) on delete cascade,
  sku text not null,
  title text not null,
  description text,
  price_cents integer,
  currency text default 'USD',
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists product_catalog_items_retailer_sku_idx
  on public.product_catalog_items (retailer_id, sku);

alter table public.product_catalog_items disable row level security;

insert into storage.buckets (id, name, public) values
  ('logos', 'logos', true),
  ('product-photos', 'product-photos', true),
  ('sku-csv-uploads', 'sku-csv-uploads', true)
on conflict (id) do nothing;
