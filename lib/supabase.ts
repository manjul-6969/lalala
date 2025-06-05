import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Location update function
export async function updateUserLocation(latitude: number, longitude: number) {
  return await supabase.rpc('upsert_user_location', {
    p_lat: latitude,
    p_lng: longitude,
  });
}

// Send distress signal
export async function sendDistressSignal(latitude: number, longitude: number) {
  return await supabase.rpc('send_distress_signal', {
    p_lat: latitude,
    p_lng: longitude,
  });
}

// Get nearby users
export async function getNearbyUsers(latitude: number, longitude: number) {
  return await supabase.rpc('nearby_users', {
    lat: latitude,
    lng: longitude,
  });
}