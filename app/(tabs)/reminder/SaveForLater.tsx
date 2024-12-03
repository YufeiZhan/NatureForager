// app/(tabs)/profile/SaveForLater.tsx
import {
  ThemedFlatList,
  ThemedView,
  ThemedButton,
  ThemedText,
} from "@/components/Themed";
import { StyleSheet, Alert, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { Reminder, loadReminders } from "@/backend/Reminder";
import ReminderListItem from "@/components/ReminderListItem";
import { pureWhite } from "@/constants/Colors";
import { emitter } from "@/scripts/EventEmitter";

export default function SaveForLater() {
  const router = useRouter();
  const [currentSeasonReminders, setCurrentSeasonReminders] = useState<
    Reminder[]
  >([]);
  const [otherSeasonReminders, setOtherSeasonReminders] = useState<Reminder[]>(
    []
  );

  // Load reminders from AsyncStorage
  useEffect(() => {
    const loadSpeciesReminder = async () => {
      const remindersData = await loadReminders();
      const currentMonth = new Date().toLocaleString("default", {
        month: "short",
      });

      const currentSeason = remindersData.filter((reminder) =>
        reminder.months
          .map((month) => month.substring(0, 3))
          .includes(currentMonth)
      );

      const otherSeason = remindersData.filter(
        (reminder) =>
          !reminder.months
            .map((month) => month.substring(0, 3))
            .includes(currentMonth)
      );

      setCurrentSeasonReminders(currentSeason);
      setOtherSeasonReminders(otherSeason);
    };

    // ask for notification permission
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please enable notifications to receive reminders."
        );
      }
    };

    loadSpeciesReminder();
    requestNotificationPermission();

    const handleRemindersUpdated = () => {
      loadSpeciesReminder();
    };

    emitter.on("remindersUpdated", handleRemindersUpdated);

    return () => {
      emitter.off("remindersUpdated", handleRemindersUpdated); // Clean up listener
    };
  }, []);

  return (
    <ThemedView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <ThemedFlatList
        data={currentSeasonReminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ReminderListItem
            id={item.id}
            name={item.name}
            months={item.months}
            type={item.type}
            frequency={item.frequency}
            imageURL={item.imageURL}
          />
        )}
      /> */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Current Season</ThemedText>

          {currentSeasonReminders.map((item) => (
            <ReminderListItem
              id={item.id}
              name={item.name}
              months={item.months}
              type={item.type}
              frequency={item.frequency}
              imageURL={item.imageURL}
            />
          ))}
        </ThemedView>

        {/* <ThemedFlatList
        data={otherSeasonReminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ReminderListItem
            id={item.id}
            name={item.name}
            months={item.months}
            type={item.type}
            frequency={item.frequency}
            imageURL={item.imageURL}
          />
        )}
      /> */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Other Seasons</ThemedText>
          {otherSeasonReminders.map((item) => (
            <ReminderListItem
              id={item.id}
              name={item.name}
              months={item.months}
              type={item.type}
              frequency={item.frequency}
              imageURL={item.imageURL}
            />
          ))}
        </ThemedView>
      </ScrollView>

      <ThemedButton
        title="Add New Reminder"
        action="secondary"
        onPress={() => router.push("/reminder/SetReminderScreen")}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
  scrollContainer: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 36,
    textDecorationLine: "underline",
    color: pureWhite,
  },
  section: {
    flex: 1,
    gap: 16,
    justifyContent: "flex-start",
    minHeight: 200,
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 40,
  },
});
