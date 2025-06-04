/*
  # Initial Schema for SafeStreets Bangladesh

  1. New Tables
    - users
      - Stores user information and authentication details
    - incidents
      - Stores reported incidents with location data
    - alerts
      - Stores safety alerts for specific areas
    - resources
      - Stores educational resources and safety guides

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for public access to resources
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone_number text,
  emergency_contacts jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  type text NOT NULL,
  description text NOT NULL,
  location_lat double precision NOT NULL,
  location_lng double precision NOT NULL,
  location_address text,
  severity text NOT NULL,
  status text DEFAULT 'pending',
  is_anonymous boolean DEFAULT true,
  evidence_urls text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  severity text NOT NULL,
  location_lat double precision NOT NULL,
  location_lng double precision NOT NULL,
  location_address text,
  radius integer DEFAULT 500, -- Alert radius in meters
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content jsonb NOT NULL,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Incidents policies
CREATE POLICY "Anyone can create incidents"
  ON incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read incidents within radius"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (
    ST_DWithin(
      ST_MakePoint(location_lng, location_lat)::geography,
      ST_MakePoint(
        cast(current_setting('app.current_lng', true) as float),
        cast(current_setting('app.current_lat', true) as float)
      )::geography,
      500 -- 500 meters radius
    )
  );

-- Alerts policies
CREATE POLICY "Anyone can read active alerts"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (
    is_active = true AND
    (expires_at IS NULL OR expires_at > now())
  );

-- Resources policies
CREATE POLICY "Anyone can read resources"
  ON resources
  FOR SELECT
  TO anon
  USING (true);

-- Functions
CREATE OR REPLACE FUNCTION nearby_incidents(
  lat double precision,
  lng double precision,
  radius_meters integer DEFAULT 500
)
RETURNS SETOF incidents
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM incidents
  WHERE ST_DWithin(
    ST_MakePoint(location_lng, location_lat)::geography,
    ST_MakePoint(lng, lat)::geography,
    radius_meters
  )
  AND created_at > now() - interval '24 hours'
  ORDER BY created_at DESC;
$$;