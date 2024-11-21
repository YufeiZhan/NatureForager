import { Pressable, StyleSheet, Image, Dimensions } from "react-native";
import { ThemedView, ThemedText } from "@/components/Themed";
import { darkGreen, oliveGreen, pureWhite } from "@/constants/Colors";
import { Reminder } from '@/backend/Reminder';
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
        {/* <Image source={require("@/assets/plant/fruit.png")} style={styles.icon} /> */}
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
        style={{color: oliveGreen, flexShrink: 1}}
        numberOfLines={1}
        ellipsizeMode="tail"
        >
          {abbreviatedMonths.join(", ")}
        </ThemedText>
      </ThemedView>
    </Pressable>

    <Pressable 
      onPress={handleSelectSpecies} 
      style={styles.button}>
        <ThemedText>Edit</ThemedText>
    </Pressable>

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
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.8,
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
  button: {
    backgroundColor: darkGreen,
    alignItems: "center",
    marginLeft: 10,
    padding: 10,
    borderRadius: 15,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 10 
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});