-- Supabase schema for Wellcart Farm
-- Creates retailer and product catalog tables, disables RLS, and seeds public storage buckets.

create extension if not exists "uuid-ossp";

create table if not exists public.retailer_profiles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text,
  logo_url text,
  revenue numeric,
  store_count integer,
  gmv numeric,
  offers_ecommerce boolean default false,
  offers_delivery boolean default false,
  channel_partner text,
  pos_system text,
  contact_name text,
  contact_email text,
  contact_phone text,
  onboarding_status text default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.retailer_profiles disable row level security;

drop table if exists public.product_catalog_items;

create table public.product_catalog_items (
  id uuid primary key default uuid_generate_v4(),
  retailer_id uuid references public.retailer_profiles(id) on delete cascade,
  name text,
  price numeric,
  unit_size text,
  category text,
  image_url text,
  source text not null,
  raw_payload text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_catalog_items disable row level security;

insert into storage.buckets (id, name, public) values
  ('logos', 'logos', true),
  ('product-photos', 'product-photos', true),
  ('sku-csv-uploads', 'sku-csv-uploads', true)
on conflict (id) do nothing;
