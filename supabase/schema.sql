-- ============================================================
-- Builder Portfolio — Supabase schema
-- Run this in the Supabase SQL editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- building_types ----------
create table building_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  cover_image text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ---------- buildings ----------
create table buildings (
  id uuid primary key default uuid_generate_v4(),
  type_id uuid references building_types(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  location text,
  year_built integer,
  area_sqft numeric,
  status text check (status in ('completed', 'ongoing', 'planned')) default 'completed',
  hero_image text,
  blueprint_image text,          -- line-drawing/blueprint asset for the scroll reveal
  floor_plan_url text,
  featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ---------- building_images (gallery) ----------
create table building_images (
  id uuid primary key default uuid_generate_v4(),
  building_id uuid references buildings(id) on delete cascade not null,
  url text not null,
  caption text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ---------- inquiries (contact form) ----------
create table inquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  building_id uuid references buildings(id) on delete set null,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table building_types enable row level security;
alter table buildings enable row level security;
alter table building_images enable row level security;
alter table inquiries enable row level security;

-- Public read access on catalog data
create policy "Public read building_types" on building_types
  for select using (true);

create policy "Public read buildings" on buildings
  for select using (true);

create policy "Public read building_images" on building_images
  for select using (true);

-- Anyone can submit an inquiry, but never read them back
create policy "Public insert inquiries" on inquiries
  for insert with check (true);

-- Writes to catalog tables should go through the Supabase dashboard
-- or a service-role key (e.g. an admin panel), not the anon key.
-- No insert/update/delete policies are defined for anon on
-- building_types / buildings / building_images by design.

-- ============================================================
-- Indexes
-- ============================================================
create index idx_buildings_type_id on buildings(type_id);
create index idx_buildings_featured on buildings(featured) where featured = true;
create index idx_building_images_building_id on building_images(building_id);
-- ============================================================
-- Migration v2 — Admin panel support
-- Run this AFTER schema.sql, in the Supabase SQL editor
-- ============================================================

-- ---------- site_settings (single row, controls Home hero + sections) ----------
create table site_settings (
  id integer primary key default 1,
  hero_building_id uuid references buildings(id) on delete set null,
  hero_headline text default 'Scroll to build',
  hero_eyebrow text default 'Est. from ground up',
  intro_heading text default 'Every building starts as a line on paper.',
  featured_section_heading text default 'Featured work',
  cta_heading text default 'Have a site in mind?',
  cta_button_text text default 'Start a conversation',
  stats jsonb default '[{"value":"20+","label":"Years"},{"value":"140","label":"Projects"},{"value":"35","label":"Team"},{"value":"12","label":"Cities"}]',
  constraint single_row check (id = 1)
);

insert into site_settings (id) values (1);

-- ---------- blog_posts ----------
create table blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image text,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- RLS
-- ============================================================
alter table site_settings enable row level security;
alter table blog_posts enable row level security;

create policy "Public read site_settings" on site_settings
  for select using (true);

create policy "Public read published blog_posts" on blog_posts
  for select using (published = true);

-- ---------- Admin (authenticated) write access ----------
-- Requires a Supabase Auth user to be created for the admin
-- (Authentication -> Users -> Add user in the Supabase dashboard).
-- Any authenticated session can write — fine for a single-admin site.

create policy "Authenticated manage site_settings" on site_settings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated manage building_types" on building_types
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated manage buildings" on buildings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated manage building_images" on building_images
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated manage blog_posts" on blog_posts
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated read inquiries" on inquiries
  for select using (auth.role() = 'authenticated');

create policy "Authenticated delete inquiries" on inquiries
  for delete using (auth.role() = 'authenticated');
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
