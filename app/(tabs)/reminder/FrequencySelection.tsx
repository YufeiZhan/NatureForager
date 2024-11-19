// app/FrequencySelectionScreen.tsx
/* Scheduling:
1. Schedule one notification at the beginning of each month for all species this month (9am on the first day of that month): something like "Species in Season this Month: {species that are ripe this month}" If there are more than 3 species ripe this month, just list the first 3 with "..." at the end
2. If the frequency is biweekly or weekly, send two additional reminders at 9am on the 15th and 29th day; if the frequency is weekly, send another two additional reminders on the 8th and 22nd day
Save and Delete Rule:
1. When saving a new reminder, not only schedule species notifications but also cancel the previous summary notification for this month and reschedule so we can add this new species
2. When changing the frequency for an existing reminder, cancel the previous notifications for this species and reschedule for the new frequency.
3. When deleting an existing reminder, cancel the previous notifications including this species. If there are species left for this month, reschedule the notification for this month.
*/
import { SetStateAction, useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ThemedButton, ThemedText, ThemedView } from "@/components/Themed";
import { Picker } from "@react-native-picker/picker";
import { Reminder, saveReminder, deleteReminder, loadReminders, cancelNotification, scheduleNotification } from '@/backend/Reminder';

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

  const rescheduleNotifications = async () => {
    for (const month of species.months) {
      const allReminders = await loadReminders();
      await cancelNotification(month, "monthly");
      const inSeasonSpecies = allReminders.filter(reminder => reminder.months.includes(month));
      if (inSeasonSpecies.length > 0) {
        await scheduleNotification(inSeasonSpecies, month, "monthly");
      }

      if (species.frequency == "biweekly" || species.frequency == "weekly"){
        await cancelNotification(month, "biweekly");
        const biweeklySpecies = allReminders.filter(reminder => reminder.months.includes(month) && (reminder.frequency == "biweekly" || reminder.frequency == "weekly"));
        console.log("biweekly: ", biweeklySpecies);
        if (biweeklySpecies.length > 0) {
          await scheduleNotification(biweeklySpecies, month, "biweekly");
        }
      }
      if (species.frequency == "weekly"){
        await cancelNotification(month, "weekly");
        const weeklySpecies = allReminders.filter(reminder => reminder.months.includes(month) && reminder.frequency == "weekly");
        console.log("weekly: ", weeklySpecies);
        if (weeklySpecies.length > 0) {
          await scheduleNotification(weeklySpecies, month, "weekly");
        }
      }
    }
  }

  const handleSaveReminder = async () => {
    await saveReminder(species, frequency);
    await rescheduleNotifications();

    if (returnBack){
      router.back();
    } else {
      router.push('/reminder/SaveForLater');
    }
  };

  const handleDeleteReminder = async () => {
    await deleteReminder(species.id);
    await rescheduleNotifications();

    if (returnBack){
      router.back();
    } else {
      router.push('/reminder/SaveForLater');
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