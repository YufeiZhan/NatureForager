import { Pressable, StyleSheet, Image, Dimensions } from "react-native";
import { ThemedView, ThemedText } from "./Themed";
import { useContext } from "react";
import { LocationContext } from "@/hooks/LocationContext";
import { useRouter } from "expo-router";
import { pureWhite } from "@/constants/Colors";

interface ItemData {
  taxonId: number;
  name: string;
  type: string;
  distance: number | null;
}

export default function HomeListItem(item: ItemData) {
  const { location, setLocation } = useContext(LocationContext);
  const router = useRouter();

  const getTypeIcons = (type: string): any[] => {
    const typeIconMap: { [key: string]: any } = {
      leaf: require("@/assets/plant/leaf.png"),
      flower: require("@/assets/plant/flower.png"),
      fruit: require("@/assets/plant/fruit.png"),
      nut: require("@/assets/plant/nut.png"),
      pod: require("@/assets/plant/pod.png"),
      pollen: require("@/assets/plant/pollen.png"),
      root: require("@/assets/plant/root.png"),
      shoot: require("@/assets/plant/shoot.png"),
      tea: require("@/assets/plant/tea.png"),
      tuber: require("@/assets/plant/tuber.png"),
    };
  
    // For types that share icons with other types
    const aliases: { [key: string]: string } = {
      berry: "fruit",
      seed: "pollen",
      sap: "tea",
    };
  
    const icons: any[] = [];

  const typeWords = type.toLowerCase().split(/[\s,]+/);

  // Check each type word against the keys in the typeIconMap and aliases
  typeWords.forEach((word) => {
    if (typeIconMap[word]) {
      icons.push(typeIconMap[word]);
    } else if (aliases[word]) {
      icons.push(typeIconMap[aliases[word]]);
    }
  });

  return icons;
  };
  

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/home/PlantLocation",
          params: {
            iNaturalistTaxonId: item.taxonId,
            commonName: item.name,
            initialLat: location?.latitude,
            initialLng: location?.longitude,
            distanceKmToNearest: item.distance,
          },
        });
      }}
      style={styles.container}
    >
      <ThemedView style={styles.subContainerLeft}>
        <ThemedText style={styles.title}>{item.name}</ThemedText>
        <ThemedView style={styles.iconContainer}>
          {getTypeIcons(item.type).map((icon, index) => (
            <Image
              key={index}
              source={icon}
              style={styles.icon}
            />
          ))}
      </ThemedView>
      </ThemedView>

      <ThemedView style={styles.subContainerRight}>
        <Image source={require("@/assets/pin/home.png") }></Image>
        <ThemedText style={styles.distance}>
          {item.distance ? `${Number(item.distance).toFixed(2)} km` : "None"}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: pureWhite,
    opacity: 0.8,
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  subContainerLeft: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    flex: 1, // Allows the title to take up remaining space
  },
  subContainerRight: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  title: {
    flex: 1,
    flexWrap: "wrap",
  },
  distance: {
    textAlign: "right",
    minWidth: 2,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5,
  }
});
