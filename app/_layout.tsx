import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFontResources } from '@/hooks/useFontResources';
import { Platform } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  const { isReady, fontError } = useFontResources();

  if (!isReady && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'ios' ? 'default' : 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>

      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : 'light'} // Dark UI needs light status bar
        translucent
        // backgroundColor="transparent"
      />
    </SafeAreaProvider>
  );
}
