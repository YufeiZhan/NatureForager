// app/FrequencySelectionScreen.tsx
import { SetStateAction, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, StyleSheet, View } from "react-native";
import { ThemedButton, ThemedText, ThemedView } from "@/components/Themed";
import { Picker } from "@react-native-picker/picker";
import { ReminderSpecies } from '@/backend/Reminder';

export default function FrequencySelectionScreen() {
  const router = useRouter();
  const { species: stringSpecies } = useLocalSearchParams<{ species: string }>();
  const species: ReminderSpecies = stringSpecies ? JSON.parse(stringSpecies) : null;
  const [frequency, setFrequency] = useState("monthly");

  const saveReminder = async () => {
    try {
      const storedData = await AsyncStorage.getItem("savedPlants");
      const savedPlants: { [key: number]: ReminderSpecies & { frequency: string } } = storedData ? JSON.parse(storedData) : {};

      const speciesId = species.id;
      const existingEntry = savedPlants[speciesId];
      const existingMonths = existingEntry?.months ?? [];
      const speciesMonths = species.months ?? [];
      const updatedMonths = Array.from(new Set([...existingMonths, ...speciesMonths]));

      savedPlants[speciesId] = { ...species, months: updatedMonths, frequency };
      await AsyncStorage.setItem("savedPlants", JSON.stringify(savedPlants));

      Alert.alert("Reminder saved", `You'll be reminded about ${species.name}.`);
      router.back();
    } catch (error) {
      console.error("Error saving reminder:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Select Frequency for {species.name}</ThemedText>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={frequency} onValueChange={(itemValue: SetStateAction<string>) => setFrequency(itemValue)} style={styles.picker}>
          <Picker.Item label="Monthly" value="monthly" />
          <Picker.Item label="Biweekly" value="biweekly" />
          <Picker.Item label="Weekly" value="weekly" />
        </Picker>
      </View>

      <ThemedButton title="Save Reminder" onPress={saveReminder} />
      <ThemedButton title="Cancel" onPress={() => router.back()} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pickerContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  picker: {
    width: "100%",
  },
});
