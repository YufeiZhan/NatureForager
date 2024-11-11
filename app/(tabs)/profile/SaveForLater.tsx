
// export default function SaveForLater() {
//   const [remindInAWeekScheduled, setRemindInAWeekScheduled] = useState(false);
  
//   useEffect(() => {
//     // Request notification permission
//     const requestNotificationPermission = async () => {
//       const { status } = await Notifications.requestPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert(
//           "Permission required",
//           "Please enable notifications to receive reminders.",
//           [{ text: "OK" }]
//         );
//       }
//     };

//     requestNotificationPermission();
    
//     const checkForSeasonalReminders = async () => {
//       const today = new Date();
//       const isTesting = true;
//       const currentMonth = today.toLocaleString('default', { month: 'long' });

//       if (isTesting || today.getDate() === 1) {
//         const speciesInSeason = plantData.filter(
//           (item) => item["Month Ripe"] === currentMonth
//         );

//         if (speciesInSeason.length > 0) {
//           console.log("test")
//           await Notifications.scheduleNotificationAsync({
//             content: {
//               title: "New things in season soon!",
//               body: `This month: ${speciesInSeason.map((s) => s["Common Name"]).join(", ")}`,
//               data: { speciesInSeason },
//             },
//             trigger: isTesting ? { seconds: 10 } : { day: 1, hour: 9, minute: 0, repeats: true },
//           });
//         }
//       }
//     };

//     checkForSeasonalReminders();
//   }, []);

//   // Schedule a weekly reminder if the user chooses
//   const scheduleWeeklyReminder = async () => {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Reminder!",
//         body: "Check out new seasonal plants this month!",
//       },
//       trigger: { seconds: 30 }, // For testing, set for 30 seconds; use { days: 7, hour: 9, minute: 0, repeats: true } for weekly
//     });
//     Alert.alert("Reminder set", "We'll remind you in a week.");
//     setRemindInAWeekScheduled(true);
//   };

//   return (
//     <ThemedView style={styles.container}>
//       <ThemedText>Save for Later Plants</ThemedText>
//       <ThemedFlatList
//         data={plantData}
//         keyExtractor={(item) => item["iNaturalist ID"].toString()}
//         renderItem={({ item }) => (
//           <ThemedText>
//             {item["Common Name"]} - Ripe in {item["Month Ripe"]}
//           </ThemedText>
//         )}
//       />
//       {!remindInAWeekScheduled && (
//         <ThemedButton title="Remind me in a week" onPress={scheduleWeeklyReminder} />
//       )}
//     </ThemedView>
//   );
// }
// app/(tabs)/profile/SaveForLater.tsx
import { ThemedFlatList, ThemedText, ThemedView, ThemedButton } from "@/components/Themed";
import { StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface Reminder {
  id: number;
  name: string;
  months: string[]; // Updated to handle multiple months
  frequency: string;
}

export default function SaveForLater() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load reminders from AsyncStorage
  useEffect(() => {
    const loadReminders = async () => {
      try {
        const savedReminders = await AsyncStorage.getItem('savedPlants');
        if (savedReminders) {
          const parsedReminders = JSON.parse(savedReminders);

          const remindersArray: Reminder[] = Object.values(parsedReminders).map((reminder: any) => ({
            id: reminder["iNaturalist ID"],
            name: reminder["Common Name"],
            months: reminder.months, // Already aggregated
            frequency: reminder.frequency || "monthly",
          }));

          setReminders(remindersArray);
        }
      } catch (error) {
        console.error("Failed to load reminders:", error);
      }
    };

    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission required", "Please enable notifications to receive reminders.");
      }
    };

    const checkForSeasonalReminders = async () => {
      const today = new Date();
      const isTesting = true;
      const currentMonth = today.toLocaleString('default', { month: 'long' });

      if (isTesting || today.getDate() === 1) {
        const speciesInSeason = reminders.filter(reminder => reminder.months.includes(currentMonth));
        if (speciesInSeason.length > 0) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "New things in season soon!",
              body: `This month: ${speciesInSeason.map(s => s.name).join(", ")}`,
              data: { speciesInSeason },
            },
            trigger: { seconds: 10 },
          });
        }
      }
    };

    loadReminders();
    requestNotificationPermission();
    checkForSeasonalReminders();
  }, [reminders]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Save for Later Plants</ThemedText>
      <ThemedFlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedText>
            {item.name} - Ripe in {item.months.join(", ")}
          </ThemedText>
        )}
      />
      <ThemedButton
        title="+ Add New Reminder"
        onPress={() => router.push('./SetReminderScreen')}
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