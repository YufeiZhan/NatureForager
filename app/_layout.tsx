import { Stack } from "expo-router";
import { LocationContext } from "@/hooks/LocationContext";
import { useLocation } from "@/hooks/useLocation";
import { useColorScheme } from "react-native";
import { getTheme } from "@/constants/Colors";
import { ThemeProvider } from "@react-navigation/native";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { useFavorites } from "@/hooks/useFavorites";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [location, setLocation] = useLocation();
  const favoritesAndFunctions = useFavorites();
  const mode = useColorScheme();

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
