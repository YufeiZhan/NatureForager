import { Pressable, StyleSheet, Image, Dimensions } from "react-native";
import { ThemedView, ThemedText, ThemedButton } from "@/components/Themed";
import { darkGreen, oliveGreen, pureWhite } from "@/constants/Colors";
import { Reminder } from "@/backend/Reminder";
import FrequencySelection from "@/components/FrequencySelection";
import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { LocationContext } from "@/hooks/LocationContext";

export default function ReminderListItem(item: Reminder) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const { location, setLocation } = useContext(LocationContext);

  const handleSelectSpecies = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const abbreviatedMonths = item.months.map((month) => month.substring(0, 3));

  return (
    <ThemedView style={styles.rowContainer}>
      <Pressable
        onPress={() => {
          router.push({
            pathname: "/home/PlantLocation",
            params: {
              iNaturalistTaxonId: item.id,
              commonName: item.name,
              initialLat: location?.latitude,
              initialLng: location?.longitude,
            },
          });
        }}
        style={styles.container}
      >
        <ThemedView style={styles.subContainer}>
          <Image
            source={{ uri: item.imageURL }}
            style={styles.icon}
            resizeMode="cover"
            onError={(error) => console.error("Image Load Error:", error)}
          />
        </ThemedView>

        <ThemedView style={styles.subContainer}>
          <ThemedText style={styles.title}> {item.name} </ThemedText>
          <ThemedText
            style={{
              color: oliveGreen,
              flex: 1,
              width: "100%",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {abbreviatedMonths.join(", ")}
          </ThemedText>
        </ThemedView>
      </Pressable>

      <ThemedButton title="Edit" onPress={handleSelectSpecies} />

      {isModalVisible && (
        <FrequencySelection
          species={{ ...item, frequency: "" }}
          ifBack={false}
          onClose={handleCloseModal}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    backgroundColor: pureWhite,
    opacity: 0.8,
    borderRadius: 10,
  },
  subContainer: {
    // styling relative to flex-determined width was v hard
    // so just set fixed width
    maxWidth: 225,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
