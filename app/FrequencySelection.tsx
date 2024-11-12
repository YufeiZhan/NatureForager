// app/FrequencySelectionScreen.tsx
import { SetStateAction, useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ThemedButton, ThemedText, ThemedView } from "@/components/Themed";
import { Picker } from "@react-native-picker/picker";
import { Reminder, saveReminder, deleteReminder, loadReminders } from '@/backend/Reminder';

export default function FrequencySelectionScreen() {
  const router = useRouter();
  const { species: stringSpecies } = useLocalSearchParams<{ species: string }>();
  const species: Reminder = stringSpecies ? JSON.parse(stringSpecies) : null;
  const [frequency, setFrequency] = useState("monthly");
  const [isExistingReminder, setIsExistingReminder] = useState(false);

  useEffect(() => {
    const loadSpeciesReminder = async () => {
      const reminders = await loadReminders();
      const existingReminder = reminders.find(reminder => reminder.id === species.id);

      if (existingReminder) {
        setFrequency(existingReminder.frequency);
        setIsExistingReminder(true);
      }
    };

    loadSpeciesReminder();
  }, [species.id]);

  const handleSaveReminder = async () => {
    await saveReminder(species, frequency);
    router.back();
  };

  const handleDeleteReminder = async () => {
    await deleteReminder(species.id);
    router.back();
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

      <ThemedButton title="Save Reminder" onPress={handleSaveReminder} />
      {isExistingReminder && (
        <ThemedButton title="Delete Reminder" onPress={handleDeleteReminder} />
      )}
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
