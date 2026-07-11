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
