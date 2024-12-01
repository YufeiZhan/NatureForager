import { Pressable, StyleSheet, Image, Dimensions } from "react-native";
import { ThemedView, ThemedText } from "@/components/Themed";
import { oliveGreen, pureWhite } from "@/constants/Colors";
import { ReminderSpecies } from "@/backend/Reminder";
import FrequencySelection from "@/components/FrequencySelection";
import { useState } from "react";
import { getTypeIcons } from "@/scripts/getTypeIcons";

export default function SuggestionListItem(item: ReminderSpecies) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelectSpecies = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const abbreviatedMonths = item.months.map((month) => month.substring(0, 3));

  return (
    <>
      <Pressable onPress={handleSelectSpecies} style={styles.container}>
        <ThemedView style={styles.subContainer}>
          <ThemedText> {item.name} </ThemedText>
          {/* <Image source={require("@/assets/plant/fruit.png")} style={styles.icon} /> */}
          <ThemedView style={styles.iconContainer}>
            {getTypeIcons(item.type).map((icon, index) => (
              <Image key={index} source={icon} style={styles.icon} />
            ))}
          </ThemedView>
          <ThemedText
            style={{ color: oliveGreen, flexShrink: 1 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Ripe in: {abbreviatedMonths.join(", ")}
          </ThemedText>
        </ThemedView>
      </Pressable>

      {isModalVisible && (
        <FrequencySelection
          species={{ ...item, frequency: "", imageURL: "" }}
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
    flexDirection: "column",
    alignItems: "flex-start",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  icon: {
    margin: 5,
    height: 30,
    width: 30,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  }
});