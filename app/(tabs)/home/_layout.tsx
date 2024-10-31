// app/home/_layout.tsx
import { Stack } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';

export default function HomeStack() {
  return (
    <Stack
      screenOptions ={{
        headerTitleStyle: { ...globalStyles.headerTitleStyle},
        headerBackTitle: "Back"
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        options={{ title: 'Nature Forager' }}
      />
      <Stack.Screen
        name="PlantLocation"
        options={{ title: 'Plant Locations' }}
      />
    </Stack>
  );
}
