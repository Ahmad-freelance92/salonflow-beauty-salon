/*
# SalonFlow — initial schema and demo seed data

## Summary
Creates the core tables for a beauty salon appointment management prototype:
locations, services, stylists, customers, and appointments. Seeds realistic
demo data for two New York salon locations, six services, four stylists, a
handful of demo customers, and a spread of appointments across statuses.

## New Tables
1. `locations` — salon locations (id, name, address, city, state, zip, phone, email, hours JSON, image_url)
2. `services` — offered services (id, name, description, price, duration_minutes, image_url, active)
3. `stylists` — staff stylists (id, name, specialty, bio, image_url, location_id, working_hours JSON, available)
4. `customers` — customer records (id, full_name, email, phone, notes, created_at)
5. `appointments` — bookings (id, booking_ref, customer_id, service_id, stylist_id, location_id, date, time, status, special_requests, created_at)

## Relationships
- appointments.customer_id → customers.id
- appointments.service_id → services.id
- appointments.stylist_id → stylists.id
- appointments.location_id → locations.id
- stylists.location_id → locations.id

## Security
- RLS enabled on every table.
- Policies allow anon + authenticated full CRUD (single-tenant demo app, no sign-in).
- Grants match the policy roles.

## Notes
1. All ids are stable explicit uuids so seed references resolve on every rebuild.
2. A unique constraint on (stylist_id, date, time) prevents double-booking the same stylist at the same slot.
3. booking_ref is unique and generated client-side, but a default fallback is provided.
*/

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL DEFAULT 'New York',
  state text NOT NULL DEFAULT 'NY',
  zip text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  hours jsonb NOT NULL,
  image_url text
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON locations TO anon, authenticated;
DROP POLICY IF EXISTS "anon_select_locations" ON locations;
CREATE POLICY "anon_select_locations" ON locations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_locations" ON locations;
CREATE POLICY "anon_insert_locations" ON locations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_locations" ON locations;
CREATE POLICY "anon_update_locations" ON locations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_locations" ON locations;
CREATE POLICY "anon_delete_locations" ON locations FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  duration_minutes int NOT NULL DEFAULT 60,
  image_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON services TO anon, authenticated;
DROP POLICY IF EXISTS "anon_select_services" ON services;
CREATE POLICY "anon_select_services" ON services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_services" ON services;
CREATE POLICY "anon_insert_services" ON services FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_services" ON services;
CREATE POLICY "anon_update_services" ON services FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_services" ON services;
CREATE POLICY "anon_delete_services" ON services FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS stylists (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  specialty text NOT NULL,
  bio text,
  image_url text,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  working_hours jsonb NOT NULL,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE stylists ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON stylists TO anon, authenticated;
DROP POLICY IF EXISTS "anon_select_stylists" ON stylists;
CREATE POLICY "anon_select_stylists" ON stylists FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_stylists" ON stylists;
CREATE POLICY "anon_insert_stylists" ON stylists FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_stylists" ON stylists;
CREATE POLICY "anon_update_stylists" ON stylists FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_stylists" ON stylists;
CREATE POLICY "anon_delete_stylists" ON stylists FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON customers TO anon, authenticated;
DROP POLICY IF EXISTS "anon_select_customers" ON customers;
CREATE POLICY "anon_select_customers" ON customers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_customers" ON customers;
CREATE POLICY "anon_insert_customers" ON customers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_customers" ON customers;
CREATE POLICY "anon_update_customers" ON customers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_customers" ON customers;
CREATE POLICY "anon_delete_customers" ON customers FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref text UNIQUE NOT NULL DEFAULT ('SF-' || upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8))),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  stylist_id uuid NOT NULL REFERENCES stylists(id) ON DELETE RESTRICT,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
  date date NOT NULL,
  time text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  special_requests text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT appointments_status_check CHECK (status IN ('pending','confirmed','completed','cancelled')),
  CONSTRAINT appointments_no_double_booking UNIQUE (stylist_id, date, time)
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON appointments TO anon, authenticated;
DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
CREATE POLICY "anon_select_appointments" ON appointments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments" ON appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;
CREATE POLICY "anon_update_appointments" ON appointments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_appointments" ON appointments;
CREATE POLICY "anon_delete_appointments" ON appointments FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_location ON appointments(location_id);

-- Seed: locations
INSERT INTO locations (id, name, address, city, state, zip, phone, email, hours, image_url) VALUES
('11111111-1111-1111-1111-111111111101', 'SalonFlow — Forsyth Street', '104 Forsyth Street', 'New York', 'NY', '10002', '(212) 555-0142', 'forsyth@salonflow.demo',
'{"Mon":"9:00 AM – 7:00 PM","Tue":"9:00 AM – 7:00 PM","Wed":"9:00 AM – 7:00 PM","Thu":"9:00 AM – 8:00 PM","Fri":"9:00 AM – 8:00 PM","Sat":"9:00 AM – 6:00 PM","Sun":"10:00 AM – 5:00 PM"}',
'https://images.pexels.com/photos/7195803/pexels-photo-7195803.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')
ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, name, address, city, state, zip, phone, email, hours, image_url) VALUES
('11111111-1111-1111-1111-111111111102', 'SalonFlow — Broome Street', '139 Broome Street', 'New York', 'NY', '10002', '(212) 555-0188', 'broome@salonflow.demo',
'{"Mon":"9:00 AM – 7:00 PM","Tue":"9:00 AM – 7:00 PM","Wed":"9:00 AM – 7:00 PM","Thu":"9:00 AM – 8:00 PM","Fri":"9:00 AM – 8:00 PM","Sat":"9:00 AM – 6:00 PM","Sun":"Closed"}',
'https://images.pexels.com/photos/7750108/pexels-photo-7750108.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')
ON CONFLICT (id) DO NOTHING;

-- Seed: services
INSERT INTO services (id, name, description, price, duration_minutes, image_url, active) VALUES
('22222222-2222-2222-2222-222222222201', 'Women''s Haircut', 'A tailored cut and style designed around your face shape, hair texture, and personal look. Includes consultation, wash, and finish.', 65, 60, 'https://images.pexels.com/photos/4981475/pexels-photo-4981475.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true),
('22222222-2222-2222-2222-222222222202', 'Men''s Haircut', 'A precision cut with hot towel finish and styling. Clean, modern, and built to last between visits.', 45, 45, 'https://images.pexels.com/photos/3037244/pexels-photo-3037244.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true),
('22222222-2222-2222-2222-222222222203', 'Hair Coloring', 'Full-color or balayage service using premium ammonia-free color. Includes gloss treatment and style finish.', 120, 120, 'https://images.pexels.com/photos/4981476/pexels-photo-4981476.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true),
('22222222-2222-2222-2222-222222222204', 'Blowout', 'A salon-quality blow-dry and volumizing style. Smooth, bouncy, and camera-ready in 45 minutes.', 55, 45, 'https://images.pexels.com/photos/14615063/pexels-photo-14615063.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true),
('22222222-2222-2222-2222-222222222205', 'Hair Styling', 'Special-occasion styling — updos, waves, and editorial finishes for events, weddings, and photoshoots.', 75, 60, 'https://images.pexels.com/photos/15507425/pexels-photo-15507425.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true),
('22222222-2222-2222-2222-222222222206', 'Scalp Treatment', 'A restorative scalp detox and massage with essential oils to promote healthy hair growth and deep relaxation.', 85, 60, 'https://images.pexels.com/photos/8834067/pexels-photo-8834067.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true)
ON CONFLICT (id) DO NOTHING;

-- Seed: stylists
INSERT INTO stylists (id, name, specialty, bio, image_url, location_id, working_hours, available) VALUES
('33333333-3333-3333-3333-333333333301', 'Mei Tanaka', 'Color Specialist', 'Mei brings 12 years of color artistry, specializing in balayage and lived-in blondes.', 'https://images.pexels.com/photos/33867520/pexels-photo-33867520.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '11111111-1111-1111-1111-111111111101', '{"Mon":"9:00–17","Tue":"9:00–17","Wed":"off","Thu":"9:00–19","Fri":"9:00–19","Sat":"9:00–16","Sun":"10:00–15"}', true),
('33333333-3333-3333-3333-333333333302', 'Ava Romano', 'Precision Cuts', 'Ava trained in Milan and is known for her sharp, architectural cuts and curtain bangs.', 'https://images.pexels.com/photos/33867529/pexels-photo-33867529.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '11111111-1111-1111-1111-111111111101', '{"Mon":"off","Tue":"10:00–18","Wed":"10:00–18","Thu":"10:00–20","Fri":"10:00–20","Sat":"9:00–17","Sun":"off"}', true),
('33333333-3333-3333-3333-333333333303', 'Jordan Lee', 'Men''s Grooming', 'Jordan is a master of fades, tapers, and classic scissor work with a modern edge.', 'https://images.pexels.com/photos/7447152/pexels-photo-7447152.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '11111111-1111-1111-1111-111111111102', '{"Mon":"9:00–17","Tue":"9:00–17","Wed":"9:00–17","Thu":"off","Fri":"9:00–19","Sat":"9:00–17","Sun":"off"}', true),
('33333333-3333-3333-3333-333333333304', 'Sofia Delgado', 'Bridal & Events', 'Sofia styles for weddings and editorial shoots — soft updos, waves, and red-carpet finishes.', 'https://images.pexels.com/photos/33867554/pexels-photo-33867554.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '11111111-1111-1111-1111-111111111102', '{"Mon":"10:00–18","Tue":"off","Wed":"10:00–18","Thu":"10:00–20","Fri":"10:00–20","Sat":"9:00–17","Sun":"10:00–15"}', true)
ON CONFLICT (id) DO NOTHING;

-- Seed: customers
INSERT INTO customers (id, full_name, email, phone, notes, created_at) VALUES
('44444444-4444-4444-4444-444444444401', 'Emily Chen', 'emily.chen@example.com', '(917) 555-0123', 'Prefers warm tones. Allergic to ammonia.', now() - interval '90 days'),
('44444444-4444-4444-4444-444444444402', 'Marcus Bell', 'marcus.bell@example.com', '(646) 555-0148', 'Likes a tight fade, every 3 weeks.', now() - interval '60 days'),
('44444444-4444-4444-4444-444444444403', 'Priya Sharma', 'priya.sharma@example.com', '(212) 555-0199', 'Bridal client — long hair, loves updos.', now() - interval '45 days'),
('44444444-4444-4444-4444-444444444404', 'Daniel Okafor', 'daniel.okafor@example.com', '(917) 555-0177', 'Scissor cut, no clippers on top.', now() - interval '30 days'),
('44444444-4444-4444-4444-444444444405', 'Yuki Watanabe', 'yuki.w@example.com', '(646) 555-0150', 'Balayage maintenance every 8 weeks.', now() - interval '20 days'),
('44444444-4444-4444-4444-444444444406', 'Olivia Hart', 'olivia.hart@example.com', '(212) 555-0162', 'Sensitive scalp — gentle wash.', now() - interval '10 days')
ON CONFLICT (id) DO NOTHING;

-- Seed: appointments (relative to now() so the dashboard always has "today" data)
-- We insert today and near-today appointments with a mix of statuses.
INSERT INTO appointments (id, booking_ref, customer_id, service_id, stylist_id, location_id, date, time, status, special_requests, created_at) VALUES
('55555555-5555-5555-5555-555555555501', 'SF-DEMO0001', '44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', CURRENT_DATE, '10:00 AM', 'confirmed', 'Please use ammonia-free color.', now() - interval '5 days'),
('55555555-5555-5555-5555-555555555502', 'SF-DEMO0002', '44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111102', CURRENT_DATE, '11:30 AM', 'completed', NULL, now() - interval '6 days'),
('55555555-5555-5555-5555-555555555503', 'SF-DEMO0003', '44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222205', '33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111102', CURRENT_DATE, '14:00 PM', 'pending', 'Trial for October wedding.', now() - interval '2 days'),
('55555555-5555-5555-5555-555555555504', 'SF-DEMO0004', '44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111102', CURRENT_DATE, '16:00 PM', 'pending', NULL, now() - interval '1 days'),
('55555555-5555-5555-5555-555555555505', 'SF-DEMO0005', '44444444-4444-4444-4444-444444444405', '22222222-2222-2222-2222-222222222204', '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', CURRENT_DATE, '17:30 PM', 'confirmed', NULL, now() - interval '3 days'),
('55555555-5555-5555-5555-555555555506', 'SF-DEMO0006', '44444444-4444-4444-4444-444444444406', '22222222-2222-2222-2222-222222222206', '33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111101', CURRENT_DATE + interval '1 day', '10:00 AM', 'confirmed', 'Gentle scalp massage please.', now() - interval '2 days'),
('55555555-5555-5555-5555-555555555507', 'SF-DEMO0007', '44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111101', CURRENT_DATE - interval '2 day', '13:00 PM', 'completed', NULL, now() - interval '9 days'),
('55555555-5555-5555-5555-555555555508', 'SF-DEMO0008', '44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', CURRENT_DATE - interval '5 day', '15:00 PM', 'cancelled', 'Schedule conflict.', now() - interval '12 days'),
('55555555-5555-5555-5555-555555555509', 'SF-DEMO0009', '44444444-4444-4444-4444-444444444405', '22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', CURRENT_DATE + interval '2 day', '11:00 AM', 'confirmed', NULL, now() - interval '4 days'),
('55555555-5555-5555-5555-555555555510', 'SF-DEMO0010', '44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111102', CURRENT_DATE + interval '3 day', '12:00 PM', 'pending', NULL, now() - interval '1 days')
ON CONFLICT (id) DO NOTHING;
