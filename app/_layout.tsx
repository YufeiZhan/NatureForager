import { Stack } from "expo-router";
import { LocationContext } from "@/hooks/LocationContext";
import { useLocation } from "@/hooks/useLocation";
import { useColorScheme } from "react-native";
import { getTheme } from "@/constants/Colors";
import { ThemeProvider } from "@react-navigation/native";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { useFavorites } from "@/hooks/useFavorites";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts, Hubballi_400Regular } from '@expo-google-fonts/hubballi';
import { globalStyles } from "@/styles/globalStyles";
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { useRouter } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [location, setLocation] = useLocation();
  const favoritesAndFunctions = useFavorites();
  const mode = useColorScheme();

  
  const [fontsLoaded] = useFonts({
    Hubballi_400Regular,
  });

  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response received:", response); 
      const data = response.notification.request.content.data;
      if (data) {
        router.push({
          pathname: data.screen
        });
      }
    });

    return () => subscription.remove();
  }, []);

  if (fontsLoaded) {
    return (
      <GestureHandlerRootView>
        <ThemeProvider value={getTheme(mode === "dark")}>
          <LocationContext.Provider value={{ location, setLocation }}>
            <FavoritesContext.Provider value={favoritesAndFunctions}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </FavoritesContext.Provider>
          </LocationContext.Provider>
        </ThemeProvider>
      </GestureHandlerRootView>
    );
  }
}
