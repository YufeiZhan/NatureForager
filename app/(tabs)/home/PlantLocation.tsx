// app/(tabs)/profile/ProfileScreen.tsx
import { ThemedText, ThemedView } from "@/components/Themed";
import { StyleSheet } from "react-native";
import Map from "@/components/Map";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { useNonArraySearchParams } from "@/hooks/useNonArraySearchParams";

export default function PlantLocation() {
  const { iNaturalistTaxonId, commonName, initialLat, initialLng } =
    useNonArraySearchParams();

  // change screen header to match common name
  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({ title: commonName });
  }, [commonName]);

  return (
    <Map
      iNaturalistTaxonId={iNaturalistTaxonId}
      initialLat={Number(initialLat)}
      initialLng={Number(initialLng)}
    ></Map>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
