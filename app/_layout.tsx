import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFontResources } from '@/hooks/useFontResources';
import { Platform, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import OnboardingFlow from '@/components/OnboardingFlow';

export default function RootLayout() {
  useFrameworkReady();
  const { isReady, fontError } = useFontResources();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Check if user has completed onboarding
        const { data: onboardingStatus } = await supabase
          .from('onboarding_status')
          .select('onboarding_completed')
          .eq('user_id', session.user.id)
          .single();

        if (!onboardingStatus?.onboarding_completed) {
          setShowOnboarding(true);
        } else {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/login');
      }
      setIsLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      }
    });
  }, []);

  if (!isReady && !fontError) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (showOnboarding) {
    return (
      <View style={{ flex: 1 }}>
        <OnboardingFlow onComplete={() => {
          setShowOnboarding(false);
          router.replace('/(tabs)');
        }} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'ios' ? 'default' : 'fade',
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>

      <StatusBar style="light" translucent />
    </SafeAreaProvider>
  );
}