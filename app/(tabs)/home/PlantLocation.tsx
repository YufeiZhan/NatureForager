// app/(tabs)/profile/ProfileScreen.tsx
import { ThemedText, ThemedView } from "@/components/Themed";
import { StyleSheet } from "react-native";
import Map from "@/components/Map";

export default function PlantLocation() {
  return <Map iNaturalistTaxonId={83435}></Map>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
