// app/FrequencySelectionScreen.tsx
// Scheduling:
// 1. Schedule one notification at the beginning of each month (9am on the first day of that month): something like "Species in Season this Month: {species that are ripe this month}" If there are more than 3 species ripe this month, just list the first 3 with "..." at the end
// 2. For each species, send notifications according to their frequency during that month: "{species name} is in season this month!}". If the frequency is monthly, send one at 12pm on the first day of that month; if the frequency is biweekly, send one at 12pm on the first day of that month and one on the 15th and 29th day; if the frequency is weekly, send one at 12pm on the first day of that month and one on the 8th/15th/22nd/29th day
// Save and Delete Rule:
// 1. When saving a new reminder, not only Schedule individual species notifications but also cancel the previous summary notification for this month and reschedule so we can add this new species
// 2. When changing the frequency for an existing reminder, cancel the previous individual notifications for this species and reschedule for the new frequency.
// 3. When deleting an existing reminder, cancel the previous individual notifications for this species and the previous summary notification for this month. If there are species left for this month, reschedule the summary notification for this month.
import { SetStateAction, useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ThemedButton, ThemedText, ThemedView } from "@/components/Themed";
import { Picker } from "@react-native-picker/picker";
import { Reminder, saveReminder, deleteReminder, loadReminders, cancelMonthlySummaryNotification, scheduleSpeciesNotifications, scheduleMonthlySummaryNotification, cancelSpeciesNotifications } from '@/backend/Reminder';

export default function FrequencySelectionScreen() {
  const router = useRouter();
  const { species: stringSpecies, ifBack } = useLocalSearchParams<{ species: string; ifBack: string }>();
  const returnBack = ifBack === "true";
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

    // Loop over each month in which the species is ripe
    for (const month of species.months) {
      // Cancel and reschedule the monthly summary notification for each ripe month
      await cancelMonthlySummaryNotification(month);

      // Schedule notifications for this species with the new frequency
      await scheduleSpeciesNotifications(species, frequency, month);

      // Reload reminders and reschedule the summary notification for each ripe month
      const allReminders = await loadReminders();
      const inSeasonSpecies = allReminders.filter(reminder => reminder.months.includes(month));
      await scheduleMonthlySummaryNotification(inSeasonSpecies, month);
    }
    // check which workflow
    if (returnBack){
      router.back();
    } else {
      router.push('/reminder/SaveForLater');
    }
  };

  const handleDeleteReminder = async () => {
    await deleteReminder(species.id);

    for (const month of species.months) {
      // Cancel notifications for this species and the summary notification for each ripe month
      await cancelSpeciesNotifications(species.id, month);
      await cancelMonthlySummaryNotification(month);

      // Reload reminders and reschedule the summary notification if there are remaining species for each ripe month
      const allReminders = await loadReminders();
      const inSeasonSpecies = allReminders.filter(reminder => reminder.months.includes(month));

      if (inSeasonSpecies.length > 0) {
        await scheduleMonthlySummaryNotification(inSeasonSpecies, month);
      }
    }
    
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