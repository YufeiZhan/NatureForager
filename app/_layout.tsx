import { Stack } from "expo-router";
import { LocationContext } from "@/hooks/LocationContext"
import { useLocation } from "@/hooks/useLocation"

export default function RootLayout() {
  const [location, setLocation] = useLocation();

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="PlantInfoModal" options={{ presentation: "modal" }} />
      </Stack>
    </LocationContext.Provider>
  );
}
