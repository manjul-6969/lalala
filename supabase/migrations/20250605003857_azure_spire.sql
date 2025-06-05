/*
  # Add Realtime Features for SafeStreets

  1. New Tables
    - user_locations
      - Stores real-time user locations
      - Used for proximity alerts and user tracking
    - distress_signals
      - Stores emergency distress signals
      - Includes location and status information
    - onboarding_status
      - Tracks user onboarding progress
      - Stores permission states

  2. Security
    - Enable RLS on all new tables
    - Add policies for location sharing
    - Add policies for distress signals
*/

-- Create user_locations table
CREATE TABLE IF NOT EXISTS user_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  location_lat double precision NOT NULL,
  location_lng double precision NOT NULL,
  last_updated timestamptz DEFAULT now(),
  is_online boolean DEFAULT true,
  UNIQUE(user_id)
);

-- Create distress_signals table
CREATE TABLE IF NOT EXISTS distress_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  location_lat double precision NOT NULL,
  location_lng double precision NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id)
);

-- Create onboarding_status table
CREATE TABLE IF NOT EXISTS onboarding_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  location_permission boolean DEFAULT false,
  notification_permission boolean DEFAULT false,
  background_location_permission boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE distress_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_status ENABLE ROW LEVEL SECURITY;

-- User Locations Policies
CREATE POLICY "Users can update their own location"
  ON user_locations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view nearby locations"
  ON user_locations
  FOR SELECT
  TO authenticated
  USING (
    calculate_distance(
      location_lat,
      location_lng,
      cast(current_setting('app.current_lat', true) as float),
      cast(current_setting('app.current_lng', true) as float)
    ) <= 500 -- 500 meters
    AND last_updated > now() - interval '5 minutes'
    AND is_online = true
  );

-- Distress Signals Policies
CREATE POLICY "Users can create distress signals"
  ON distress_signals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view nearby distress signals"
  ON distress_signals
  FOR SELECT
  TO authenticated
  USING (
    calculate_distance(
      location_lat,
      location_lng,
      cast(current_setting('app.current_lat', true) as float),
      cast(current_setting('app.current_lng', true) as float)
    ) <= 500 -- 500 meters
    AND status = 'active'
  );

-- Onboarding Status Policies
CREATE POLICY "Users can manage their onboarding status"
  ON onboarding_status
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to get nearby users
CREATE OR REPLACE FUNCTION nearby_users(
  lat double precision,
  lng double precision,
  radius_meters integer DEFAULT 500
)
RETURNS TABLE (
  user_id uuid,
  location_lat double precision,
  location_lng double precision,
  last_updated timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    user_id,
    location_lat,
    location_lng,
    last_updated
  FROM user_locations
  WHERE
    calculate_distance(location_lat, location_lng, lat, lng) <= radius_meters
    AND last_updated > now() - interval '5 minutes'
    AND is_online = true;
$$;

-- Function to create or update user location
CREATE OR REPLACE FUNCTION upsert_user_location(
  p_lat double precision,
  p_lng double precision
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_locations (
    user_id,
    location_lat,
    location_lng
  )
  VALUES (
    auth.uid(),
    p_lat,
    p_lng
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    location_lat = p_lat,
    location_lng = p_lng,
    last_updated = now(),
    is_online = true;
END;
$$;

-- Function to send distress signal
CREATE OR REPLACE FUNCTION send_distress_signal(
  p_lat double precision,
  p_lng double precision
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_signal_id uuid;
BEGIN
  INSERT INTO distress_signals (
    user_id,
    location_lat,
    location_lng
  )
  VALUES (
    auth.uid(),
    p_lat,
    p_lng
  )
  RETURNING id INTO v_signal_id;

  RETURN v_signal_id;
END;
$$;