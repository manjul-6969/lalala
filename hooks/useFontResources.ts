import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { 
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold 
} from '@expo-google-fonts/roboto';

// Prevent the splash screen from automatically hiding
SplashScreen.preventAutoHideAsync();

export function useFontResources() {
  const [isReady, setIsReady] = useState(false);
  
  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-Bold': Roboto_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded || fontError) {
          // Hide the splash screen
          await SplashScreen.hideAsync();
          setIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);
  
  return { isReady, fontError };
}