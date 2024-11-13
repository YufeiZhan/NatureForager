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
        name="SaveForLater"
        options={{ title: 'Save for Later' }}
      />
      <Stack.Screen 
        name="SetReminderScreen" 
        options={{ title: 'Set New Reminder' }}
      />
    </Stack>
  );
}