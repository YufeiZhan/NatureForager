import { Stack } from "expo-router";
import { LocationContext } from "@/hooks/LocationContext";
import { useLocation } from "@/hooks/useLocation";
import { useColorScheme } from "react-native";
import { getTheme } from "@/constants/Colors";
import { ThemeProvider } from "@react-navigation/native";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { useFavorites } from "@/hooks/useFavorites";

export default function RootLayout() {
  const [location, setLocation] = useLocation();
  const favoritesAndFunctions = useFavorites();
  const mode = useColorScheme();

  return (
    <ThemeProvider value={getTheme(mode === "dark")}>
      <LocationContext.Provider value={{ location, setLocation }}>
        <FavoritesContext.Provider value={favoritesAndFunctions}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="SpeciesInfoModal"
              options={{ presentation: "modal", title: "" }}
            />
          </Stack>
        </FavoritesContext.Provider>
      </LocationContext.Provider>
    </ThemeProvider>
  );
}
