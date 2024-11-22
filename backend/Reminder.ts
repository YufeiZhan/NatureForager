import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { emitter } from "@/scripts/EventEmitter";

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
  imageURL: string;
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

    const response = await fetch(
      `https://api.inaturalist.org/v1/taxa/${species.id}`
    );
    const data = await response.json();
    const taxon = data.results[0];
    const imageURL = taxon.taxon_photos[0]?.photo.medium_url ||
        "https://via.placeholder.com/300x200.png?text=Image+Not+Available"

    savedPlants[speciesId] = { ...species, months: updatedMonths, frequency, imageURL};
    
    
    await AsyncStorage.setItem("savedPlants", JSON.stringify(savedPlants));
    emitter.emit("remindersUpdated");
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
      emitter.emit("remindersUpdated");
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

export const scheduleNotification = async (speciesInSeason: ReminderSpecies[], month: string, frequency: string) => {
  const speciesNames = speciesInSeason.slice(0, 3).map(s => s.name).join(", ");
  const notificationContent = speciesInSeason.length > 3 ? `${speciesNames}...` : speciesNames;
  const monthIndex = monthNames.indexOf(month);

  const biweeklyDays = [15, 29];
  const weeklyDays = [8, 22];
  const monthTrigger = { month: monthIndex + 1, hour: 9, minute: 0, repeats: true };

  if (monthIndex === -1) {
    console.error(`Invalid month: ${month}`);
    return;
  }
  
  if (frequency === "monthly") {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${month} Species in Season!`,
        body: `${speciesInSeason.length} species ripe this month: ${notificationContent}`,
        data: { 
          month,
          screen: "/reminder/SaveForLater"
        },
      },
      trigger:  ifTest
      ? { seconds: 10 }  // 20 seconds
      : { ...monthTrigger, day: 1 },
    });
  } else if (frequency === "biweekly") {
    biweeklyDays.forEach((day, index) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: `${month} Biweekly Reminder!`,
          body: `${speciesInSeason.length} species ripe this month: ${notificationContent}`,
          data: { 
            month,
            screen: "/reminder/SaveForLater"
          },
        },
        trigger: ifTest
        ? { seconds: 20 * (index + 1) }  // 20, 40 seconds for biweekly
        : { ...monthTrigger, day },
      })
    );
  } else if (frequency === "weekly") {
    weeklyDays.forEach((day, index) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: `${month} Weekly Reminder!`,
          body: `${speciesInSeason.length} species ripe this month: ${notificationContent}`,
          data: { 
            month,
            screen: "/reminder/SaveForLater"
          },
        },
        trigger: ifTest
        ? { seconds: 30 * (index + 1) }  // 30, 60 seconds for weekly
        : { ...monthTrigger, day },
      })
    );
  }
};

export const cancelNotification = async (month: string, frequency: string) => {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  if (notifications.length == 0) {
    return;
  }
  if (frequency === "monthly") {
    notifications.forEach((notification) => {
      if (notification.content.data?.month === month && notification.content.title === `${month} Species in Season!`) {
        Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    });
  } else if (frequency === "biweekly") {
    notifications.forEach((notification) => {
      if (notification.content.data?.month === month && notification.content.title === `${month} Biweekly Reminder!`) {
        Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    });
  } else if (frequency === "weekly") {
    notifications.forEach((notification) => {
      if (notification.content.data?.month === month && notification.content.title === `${month} Weekly Reminder!`) {
        Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    });
  }
};