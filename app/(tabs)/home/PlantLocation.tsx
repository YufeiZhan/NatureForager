// app/(tabs)/profile/ProfileScreen.tsx
import { ThemedText, ThemedView } from "@/components/Themed";
import { StyleSheet } from "react-native";
import Map from "@/components/Map";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { useNonArraySearchParams } from "@/hooks/useNonArraySearchParams";

export default function PlantLocation() {
  const {
    iNaturalistTaxonId,
    commonName,
    initialLat,
    initialLng,
    distanceKmToNearest,
  } = useNonArraySearchParams();

  // change screen header to match common name
  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({ title: commonName });
  }, [commonName]);

  // calculate rough latitude extent based on distance to nearest observation, default to 0.05
  let initialExtent = 0.05;
  if (!isNaN(Number(distanceKmToNearest))) {
    const kmPerDegLat = 40000 / 360; // circumference of earth is 40000 km
    const degLatToNearest = Number(distanceKmToNearest) / kmPerDegLat;
    initialExtent = 3 * degLatToNearest;
  }

  console.log(initialExtent);

  return (
    <Map
      iNaturalistTaxonId={iNaturalistTaxonId}
      initialLat={Number(initialLat)}
      initialLng={Number(initialLng)}
      initialExtent={initialExtent}
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
