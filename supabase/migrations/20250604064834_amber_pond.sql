/*
  # Initial Schema Setup for SafeStreets Bangladesh

  1. New Tables
    - users: Store user profiles and emergency contacts
    - incidents: Track reported incidents with location data
    - alerts: Manage safety alerts with radius-based targeting
    - resources: Educational and safety resources
  
  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    
  3. Changes
    - Implement basic CRUD policies
    - Use simple coordinate-based distance calculation
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

CREATE POLICY "Users can read all incidents"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (true);

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

-- Function to calculate distance between two points in meters
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 double precision,
  lng1 double precision,
  lat2 double precision,
  lng2 double precision
)
RETURNS double precision
LANGUAGE plpgsql
AS $$
DECLARE
  R constant double precision := 6371000; -- Earth's radius in meters
  φ1 double precision := radians(lat1);
  φ2 double precision := radians(lat2);
  Δφ double precision := radians(lat2 - lat1);
  Δλ double precision := radians(lng2 - lng1);
  a double precision;
  c double precision;
  d double precision;
BEGIN
  -- Haversine formula
  a := sin(Δφ/2) * sin(Δφ/2) +
       cos(φ1) * cos(φ2) *
       sin(Δλ/2) * sin(Δλ/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  d := R * c;
  RETURN d;
END;
$$;

-- Function to get nearby incidents
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
  WHERE calculate_distance(location_lat, location_lng, lat, lng) <= radius_meters
  AND created_at > now() - interval '24 hours'
  ORDER BY created_at DESC;
$$;