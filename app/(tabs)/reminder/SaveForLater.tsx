// app/(tabs)/profile/SaveForLater.tsx
import { ThemedFlatList, ThemedText, ThemedView, ThemedButton } from "@/components/Themed";
import { StyleSheet, Alert, Pressable } from "react-native";
import { useEffect, useState } from "react";
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { Reminder, loadReminders } from '@/backend/Reminder';

export default function SaveForLater() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load reminders from AsyncStorage
  useEffect(() => {
    const loadSpeciesReminder = async () => {
      const remindersData = await loadReminders();
      setReminders(remindersData)
    };

    // move to home screen
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission required", "Please enable notifications to receive reminders.");
      }
    };

    loadSpeciesReminder();
    requestNotificationPermission();
  }, []);

  const handleItemPress = (item: Reminder) => {
    router.push({
      pathname: "/reminder/FrequencySelection",
      params: { species: JSON.stringify(item) },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedFlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleItemPress(item)}>
            <ThemedText>
              {item.name} - Ripe in {item.months.join(", ")} ({item.frequency})
            </ThemedText>
          </Pressable>
        )}
      />
      <ThemedButton
        title="+ Add New Reminder"
        onPress={() => router.push('/reminder/SetReminderScreen')}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});