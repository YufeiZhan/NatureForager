// app/home/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen
        name="HomeScreen"
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="PlantLocation"
        options={{ title: 'Plant Locations' }}
      />
    </Stack>
  );
}
