-- ============================================================
-- Migration v3 — Logo, About, Clients, Brochure, Services,
-- Board of Directors, Gallery, Products
-- Run this AFTER migration_v2_admin.sql, in the Supabase SQL editor
-- ============================================================

-- ---------- site_settings: new fields ----------
alter table site_settings add column if not exists logo_url text;
alter table site_settings add column if not exists site_name text default 'Meridian Builders';
alter table site_settings add column if not exists about_heading text default 'About us';
alter table site_settings add column if not exists about_body text default 'Meridian Builders has spent two decades turning blueprints into places people live, work, and gather.';
alter table site_settings add column if not exists about_image text;
alter table site_settings add column if not exists brochure_url text;
alter table site_settings add column if not exists brochure_label text default 'Company brochure';
alter table site_settings add column if not exists clients jsonb default '[]';
alter table site_settings add column if not exists gallery_section_heading text default 'Gallery';
alter table site_settings add column if not exists products_section_heading text default 'Products';

-- ---------- services (What We Do page) ----------
create table services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  icon text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ---------- board_members ----------
create table board_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  photo_url text,
  bio text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ---------- gallery_images ----------
create table gallery_images (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  caption text,
  category text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ---------- product_categories ----------
create table product_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sort_order integer default 0
);

-- ---------- products ----------
create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references product_categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  image text,
  price_label text,
  featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- RLS
-- ============================================================
alter table services enable row level security;
alter table board_members enable row level security;
alter table gallery_images enable row level security;
alter table product_categories enable row level security;
alter table products enable row level security;

create policy "Public read services" on services for select using (true);
create policy "Public read board_members" on board_members for select using (true);
create policy "Public read gallery_images" on gallery_images for select using (true);
create policy "Public read product_categories" on product_categories for select using (true);
create policy "Public read products" on products for select using (true);

create policy "Authenticated manage services" on services
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated manage board_members" on board_members
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated manage gallery_images" on gallery_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated manage product_categories" on product_categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated manage products" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create index idx_products_category_id on products(category_id);
create index idx_gallery_images_category on gallery_images(category);
