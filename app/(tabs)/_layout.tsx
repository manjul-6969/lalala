import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import {
  Chrome as Home,
  Bell,
  MapPin,
  Shield,
  User,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );
    return () => backHandler.remove();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F7374F', // Modern vibrant accent
        tabBarInactiveTintColor: '#AAAAAA',
        tabBarLabelStyle: {
          fontFamily: 'Roboto-Medium',
          fontSize: 10,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom + 12,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 40,
          backgroundColor: 'rgba(44,44,44,0.9)', // frosted dark
          borderTopWidth: 0,
          shadowColor: '#F7374F',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 10,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <MapPin size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => <Shield size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
