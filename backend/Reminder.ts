import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";

export interface ReminderSpecies {
  id: number;
  name: string;
  type: string;
  months: string[];
}

export interface TempReminderSpecies extends ReminderSpecies {
  monthRipe: string;
}

export interface Reminder extends ReminderSpecies {
  frequency: string;
}

// Function to load all reminders from AsyncStorage
export const loadReminders = async (): Promise<Reminder[]> => {
  try {
    const storedData = await AsyncStorage.getItem("savedPlants");
    console.log(storedData)
    const reminders = storedData ? JSON.parse(storedData) : {};
    return Object.values(reminders);
  } catch (error) {
    console.error("Failed to load reminders:", error);
    return [];
  }
};

// Function to save a reminder to AsyncStorage
export const saveReminder = async (
  species: Reminder,
  frequency: string
): Promise<void> => {
  try {
    const storedData = await AsyncStorage.getItem("savedPlants");
    const savedPlants: { [key: number]: Reminder } = storedData
      ? JSON.parse(storedData)
      : {};

    const speciesId = species.id;
    const existingEntry = savedPlants[speciesId];
    const existingMonths = existingEntry?.months ?? [];
    const speciesMonths = species.months ?? [];
    const updatedMonths = Array.from(
      new Set([...existingMonths, ...speciesMonths])
    );

    savedPlants[speciesId] = { ...species, months: updatedMonths, frequency };

    await AsyncStorage.setItem("savedPlants", JSON.stringify(savedPlants));
    console.log(savedPlants);
    Alert.alert("Reminder saved", `You'll be reminded about ${species.name}.`);
  } catch (error) {
    console.error("Error saving reminder:", error);
  }
};

// Function to delete a reminder from AsyncStorage
export const deleteReminder = async (speciesId: number): Promise<void> => {
  try {
    const storedData = await AsyncStorage.getItem("savedPlants");
    const savedPlants = storedData ? JSON.parse(storedData) : {};

    if (savedPlants[speciesId]) {
      delete savedPlants[speciesId];
      await AsyncStorage.setItem("savedPlants", JSON.stringify(savedPlants));
      Alert.alert(
        "Reminder deleted",
        "The reminder has been successfully removed."
      );
    } else {
      Alert.alert("Reminder not found", "No reminder found to delete.");
    }
  } catch (error) {
    console.error("Error deleting reminder:", error);
  }
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const ifTest = true;

export const cancelSpeciesNotifications = async (speciesId: number, month: string) => {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();

  // Filter and cancel notifications matching both the species ID and month
  notifications.forEach((notification) => {
    if (
      notification.content.data?.speciesId === speciesId &&
      notification.content.data?.month === month
    ) {
      Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  });
};

// Schedule notifications based on the frequency of each species
export const scheduleSpeciesNotifications = async (species: Reminder, frequency: string, month: string) => {
  await cancelSpeciesNotifications(species.id, month); // Cancel any previous notifications for this species in the specified month
  const monthIndex = monthNames.indexOf(month);
  if (monthIndex === -1) {
    console.error(`Invalid month: ${month}`);
    return;
  }

  const biweeklyDays = [1, 15, 29];
  const weeklyDays = [1, 8, 15, 22, 29];
  const monthTrigger = { month: monthIndex + 1, hour: 12, minute: 0, repeats: true };

  if (frequency === "monthly") {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${species.name} Reminder`,
        body: `${species.name} is in season this month!`,
        data: { speciesId: species.id, month },
      },
      trigger:  ifTest
      ? { seconds: 20 }  // 20 seconds
      : { ...monthTrigger, day: 1 },
    });
  } else if (frequency === "biweekly") {
    biweeklyDays.forEach((day, index) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: `${species.name} Reminder`,
          body: `${species.name} is in season this month!`,
          data: { speciesId: species.id, month },
        },
        trigger: ifTest
        ? { seconds: 20 * (index + 1) }  // 20, 40, 60 seconds for biweekly
        : { ...monthTrigger, day },
      })
    );
  } else if (frequency === "weekly") {
    weeklyDays.forEach((day, index) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: `${species.name} Reminder`,
          body: `${species.name} is in season this month!`,
          data: { speciesId: species.id, month },
        },
        trigger: ifTest
        ? { seconds: 10 * (index + 1) }  // 10, 20, 30, 40, 50 seconds for weekly
        : { ...monthTrigger, day },
      })
    );
  }
};

// Schedule monthly summary notification for a specific month
export const scheduleMonthlySummaryNotification = async (speciesInSeason: ReminderSpecies[], month: string) => {
  const speciesNames = speciesInSeason.slice(0, 3).map(s => s.name).join(", ");
  const notificationContent = speciesInSeason.length > 3 ? `${speciesNames}...` : speciesNames;

  // Get month number from the month name
  const monthIndex = monthNames.indexOf(month);
  if (monthIndex === -1) {
    console.error(`Invalid month: ${month}`);
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${month} Species in Season:`,
      body: `Species ripe this month: ${notificationContent}`,
      data: { month },
    },
    trigger: ifTest
    ? { seconds: 30}  // 30 seconds
    :{
      month: monthIndex + 1, // Adjust for 1-based month index required by notifications API
      day: 1,
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
};

// Cancel monthly summary notification for a specific month
export const cancelMonthlySummaryNotification = async (month: string) => {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();

  notifications.forEach((notification) => {
    if (notification.content.data?.month === month && notification.content.title === `${month} Species in Season:`) {
      Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  });
};