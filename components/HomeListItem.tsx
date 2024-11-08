import { Pressable, StyleSheet, Image, Dimensions } from "react-native";
import { ThemedView, ThemedText } from "./Themed";
import { useContext } from "react";
import { LocationContext } from "@/hooks/LocationContext";
import { useRouter } from "expo-router";
import { pureWhite } from "@/constants/Colors";

interface ItemData {
  taxonId: number;
  name: string;
  distance: number | null;
}

export default function HomeListItem(item: ItemData) {
  const { location, setLocation } = useContext(LocationContext);
  const router = useRouter();

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
        <Image source={require("@/assets/plant/fruit.png")} style={styles.icon} ></Image>
        <ThemedText style={styles.title}> {item.name} </ThemedText>
      </ThemedView>

      <ThemedView style={styles.subContainerRight}>
        <Image source={require("@/assets/pin/home.png")} style={styles.icon} ></Image>
        <ThemedText style={styles.distance}> 
          {item.distance ? `${Number(item.distance).toFixed(2)} km` : "None"}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

// todo: fontSize unadjustable???
// todo: a lot of flying fetching observations errors, not very stable
//  - would be better if the results get rendered after all data fetched and use activity indicator before
export const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: pureWhite,
    opacity: 0.8,
    marginVertical: 5,
    borderRadius:10,
  },
  subContainerRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10, 
  },
  subContainerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Allows the title to take up remaining space
  },
  icon: {
    margin: 10
  },
  title: {
    fontSize: 100,
  },
  distance: {
    textAlign: "right",
    minWidth: 2,
  },
})