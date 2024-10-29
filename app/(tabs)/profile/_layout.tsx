// app/home/_layout.tsx
import { Stack } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';

export default function ProfileStack() {
  return (
    <Stack
      screenOptions ={{
        headerTitleStyle: { ...globalStyles.headerTitleStyle},
        headerBackTitle: "Back"
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        options={{ title: 'My Plants' }}
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
