import { Stack } from "expo-router";
import { LocationContext } from "@/hooks/LocationContext"
import { useLocation } from "@/hooks/useLocation"
import { useColorScheme } from "react-native";
import { getTheme } from "@/constants/Colors";
import { ThemeProvider } from "@react-navigation/native";

export default function RootLayout() {
  const [location, setLocation] = useLocation();
  const mode = useColorScheme()

  return (
    <ThemeProvider value={getTheme(mode === 'dark')}>
      <LocationContext.Provider value={{ location, setLocation }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="SpeciesInfoModal" options={{ presentation: "modal" }} />
        </Stack>
      </LocationContext.Provider>
    </ThemeProvider>
  );
}
