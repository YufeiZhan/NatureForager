import { Pressable, StyleSheet, Image, Dimensions } from "react-native";
import { ThemedView, ThemedText } from "@/components/Themed";
import { useRouter } from "expo-router";
import { pureWhite } from "@/constants/Colors";
import { ReminderSpecies } from '@/backend/Reminder';
import FrequencySelection from "@/components/FrequencySelection";
import { useState } from "react";

export default function SuggestionListItem(item: ReminderSpecies) {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

//   const handleSelectSpecies = (species: ReminderSpecies) => {
//     router.push({
//       pathname: "/reminder/FrequencySelection",
//       params: { 
//         species: JSON.stringify(species),
//         ifBack: "false"
//       },
//     });
//   };
  const handleSelectSpecies = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const abbreviatedMonths = item.months.map((month) => month.substring(0, 3));

  return (
    <>
    <Pressable
      onPress={handleSelectSpecies}
      style={styles.container}
    >
      <ThemedView style={styles.subContainer}>
        <Image source={require("@/assets/plant/fruit.png")} style={styles.icon} />
        <ThemedText style={styles.title}> {item.name} </ThemedText>
      </ThemedView>

      <ThemedView style={styles.subContainer}>
        <ThemedText>Ripe in: {abbreviatedMonths.join(", ")}</ThemedText>
      </ThemedView>
    </Pressable>

    {isModalVisible && (
      <FrequencySelection
        species={{ ...item, frequency: "" }}
        ifBack={true}
        onClose={handleCloseModal}
      />
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: pureWhite,
    opacity: 0.8,
    marginVertical: 5,
    borderRadius: 10,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  icon: {
    margin: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});