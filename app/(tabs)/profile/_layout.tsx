// app/home/_layout.tsx
import { Stack } from 'expo-router';

export default function ProfileStack() {
  return (
    <Stack>
      <Stack.Screen
        name="ProfileScreen"
        options={{ title: 'User Profile' }}
      />
      <Stack.Screen
        name="Favorites"
        options={{ title: 'Favorites' }}
      />
      <Stack.Screen
        name="SaveForLater"
        options={{ title: 'Save for Later' }}
      />
    </Stack>
  );
}
