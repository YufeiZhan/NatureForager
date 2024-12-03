// app/FrequencySelectionScreen.tsx
/* Scheduling:
1. Schedule one notification at the beginning of each month for all species this month (9am on the first day of that month): something like "Species in Season this Month: {species that are ripe this month}" If there are more than 3 species ripe this month, just list the first 3 with "..." at the end
2. If the frequency is biweekly or weekly, send two additional reminders at 9am on the 15th and 29th day; if the frequency is weekly, send another two additional reminders on the 8th and 22nd day
Save and Delete Rule:
1. When saving a new reminder, not only schedule species notifications but also cancel the previous summary notification for this month and reschedule so we can add this new species
2. When changing the frequency for an existing reminder, cancel the previous notifications for this species and reschedule for the new frequency.
3. When deleting an existing reminder, cancel the previous notifications including this species. If there are species left for this month, reschedule the notification for this month.
*/
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Modal, StyleSheet, View } from "react-native";
import { ThemedButton, ThemedText, ThemedView } from "@/components/Themed";
import {
  Reminder,
  saveReminder,
  deleteReminder,
  loadReminders,
  cancelNotification,
  scheduleNotification,
} from "@/backend/Reminder";
import { oliveGreen, pureWhite } from "@/constants/Colors";
import DropDownPicker from "react-native-dropdown-picker";

interface FrequencySelectionProps {
  species: Reminder;
  ifBack: boolean;
  onClose: () => void;
}

export default function FrequencySelection({
  species,
  ifBack,
  onClose,
}: FrequencySelectionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [isExistingReminder, setIsExistingReminder] = useState(false);
  const [items, setItems] = useState([
    { label: "Monthly", value: "monthly" },
    { label: "Biweekly", value: "biweekly" },
    { label: "Weekly", value: "weekly" },
  ]);

  useEffect(() => {
    const loadSpeciesReminder = async () => {
      const reminders = await loadReminders();
      const existingReminder = reminders.find(
        (reminder) => reminder.id === species.id
      );

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
      const inSeasonSpecies = allReminders.filter((reminder) =>
        reminder.months.includes(month)
      );
      if (inSeasonSpecies.length > 0) {
        await scheduleNotification(inSeasonSpecies, month, "monthly");
      }

      if (species.frequency == "biweekly" || species.frequency == "weekly") {
        await cancelNotification(month, "biweekly");
        const biweeklySpecies = allReminders.filter(
          (reminder) =>
            reminder.months.includes(month) &&
            (reminder.frequency == "biweekly" || reminder.frequency == "weekly")
        );
        console.log("biweekly: ", biweeklySpecies);
        if (biweeklySpecies.length > 0) {
          await scheduleNotification(biweeklySpecies, month, "biweekly");
        }
      }
      if (species.frequency == "weekly") {
        await cancelNotification(month, "weekly");
        const weeklySpecies = allReminders.filter(
          (reminder) =>
            reminder.months.includes(month) && reminder.frequency == "weekly"
        );
        console.log("weekly: ", weeklySpecies);
        if (weeklySpecies.length > 0) {
          await scheduleNotification(weeklySpecies, month, "weekly");
        }
      }
    }
  };

  const handleSaveReminder = async () => {
    await saveReminder(species, frequency);
    await rescheduleNotifications();

    onClose();
    if (ifBack) {
      router.back();
    }
  };

  const handleDeleteReminder = async () => {
    await deleteReminder(species.id);
    await rescheduleNotifications();

    onClose();
    if (ifBack) {
      router.back();
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={true}
      transparent={false}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <ThemedText style={styles.header}>Edit Reminder</ThemedText>
        <ThemedText style={styles.subtitle}>
          Select Frequency for {species.name}
        </ThemedText>

        <View style={styles.pickerContainer}>
          <DropDownPicker
            open={open}
            value={frequency}
            items={items}
            setOpen={setOpen}
            setValue={setFrequency}
            setItems={setItems}
            onChangeValue={(value) => setFrequency(value!)}
            style={{
              width: 280,
              marginVertical: 20,
              borderWidth: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: pureWhite,
              opacity: 0.8,
            }}
            dropDownContainerStyle={{
              backgroundColor: pureWhite,
            }}
            dropDownDirection="AUTO"
          />
        </View>

        <ThemedView style={styles.buttons}>
          <ThemedButton title="Save Reminder" onPress={handleSaveReminder} />
          {isExistingReminder && (
            <ThemedButton
              title="Delete Reminder"
              action="secondary"
              onPress={handleDeleteReminder}
            />
          )}
          <ThemedButton
            title="Cancel"
            action="secondary"
            onPress={() => onClose()}
          />
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: oliveGreen,
  },
  pickerContainer: {
    width: "100%",
    paddingHorizontal: 30,
    marginVertical: 20,
    zIndex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: pureWhite,
    marginBottom: 80,
  },
  subtitle: {
    fontSize: 18,
    color: pureWhite,
    textAlign: "center",
    marginBottom: 10,
  },
  buttons: {
    flex: 1,
    height: 300,
    gap: 20,
  },
});
