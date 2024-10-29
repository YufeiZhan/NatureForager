import { useRouter } from "expo-router";
import { ThemedView, ThemedText } from "./Themed";
import { StyleSheet, Image, Dimensions } from "react-native";
import { pureWhite } from "@/constants/Colors";

interface PlantListProps {
  taxonId: number,
  nearest: {},
  distance: string | null,
  speciesName: string,
  location : { latitude: number; longitude: number } | null
}

export default function PlantList(props: PlantListProps) {
  const router = useRouter();

  return (
    <ThemedView
        onTouchEnd={() => {
          router.push({
            pathname: "./PlantLocation",
            params: { 
              iNaturalistTaxonId: props.taxonId, 
              commonName: props.speciesName, 
              lat: props.location?.latitude, 
              long: props.location?.longitude,
            },
          });
        }}
        style={styles.container}
    >

      <ThemedView style={styles.subContainer}>
        <Image source={require("@/assets/plant/fruit.png")} style={styles.icon} ></Image>
        <ThemedText style={styles.title}> {props.speciesName} </ThemedText>
      </ThemedView>

      <ThemedView style={styles.subContainer}>
        <Image source={require("@/assets/pin/home.png")} style={styles.icon} ></Image>
        <ThemedText> 
          {props.distance? `${props.distance} km` : " None"}
        </ThemedText>
      </ThemedView>

    </ThemedView>
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
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10
  },
  icon: {
    margin: 10
  },
  title: {
    fontSize: 100,
  }
})