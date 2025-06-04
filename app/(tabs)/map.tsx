import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Shield, AlertTriangle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';

type Incident = {
  id: string;
  type: string;
  severity: string;
  location_lat: number;
  location_lng: number;
  created_at: string;
};

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Initial fetch of incidents
      fetchNearbyIncidents(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  useEffect(() => {
    // Set up real-time subscription for new incidents
    const channel = supabase
      .channel('incidents')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'incidents',
        },
        (payload) => {
          setIncidents((current) => [...current, payload.new as Incident]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNearbyIncidents = async (lat: number, lng: number) => {
    const { data, error } = await supabase
      .rpc('nearby_incidents', {
        lat,
        lng,
        radius_meters: 500
      });

    if (data) {
      setIncidents(data);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return Colors.danger[500];
      case 'medium':
        return Colors.warning[500];
      case 'low':
        return Colors.success[500];
      default:
        return Colors.neutral[500];
    }
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {incidents.map((incident) => (
          <React.Fragment key={incident.id}>
            <Marker
              coordinate={{
                latitude: incident.location_lat,
                longitude: incident.location_lng,
              }}
              onPress={() => router.push(`/incidents/${incident.id}`)}
            >
              <View style={[
                styles.marker,
                { backgroundColor: getSeverityColor(incident.severity) }
              ]}>
                <AlertTriangle size={16} color={Colors.white} />
              </View>
            </Marker>
            <Circle
              center={{
                latitude: incident.location_lat,
                longitude: incident.location_lng,
              }}
              radius={100}
              fillColor={`${getSeverityColor(incident.severity)}20`}
              strokeColor={getSeverityColor(incident.severity)}
              strokeWidth={1}
            />
          </React.Fragment>
        ))}
      </MapView>

      <Pressable
        style={styles.reportButton}
        onPress={() => router.push('/report')}
      >
        <Shield size={24} color={Colors.white} />
        <Text style={styles.reportButtonText}>Report Incident</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  map: {
    flex: 1,
  },
  marker: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportButtonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
});