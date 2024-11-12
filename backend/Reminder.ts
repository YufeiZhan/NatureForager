import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export interface ReminderSpecies {
  id: number;
  name: string;
  type: string;
  //   monthRipe: string;
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