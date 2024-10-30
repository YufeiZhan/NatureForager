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

  // calculate rough lat/lng extent based on distance to nearest observation, default to 0.05
  let initialLatExtent = 0.05;
  let initialLngExtent = 0.05;
  if (!isNaN(Number(distanceKmToNearest)) && !isNaN(Number(initialLat))) {
    const kmPerDegLat = 40000 / 360; // circumference of earth is 40000 km
    const degLatToNearest = Number(distanceKmToNearest) / kmPerDegLat;
    initialLatExtent = 3 * degLatToNearest;

    const latRadians = (Math.PI * Number(initialLat)) / 180;
    const circumKmAtLatitude = 40000 * Math.cos(latRadians);
    const kmPerDegLng = circumKmAtLatitude / 360;
    const degLngToNearest = Number(distanceKmToNearest) / kmPerDegLng;
    initialLngExtent = 3 * degLngToNearest;
  }

  console.log(initialLatExtent, initialLngExtent);

  return (
    <Map
      iNaturalistTaxonId={iNaturalistTaxonId}
      initialLat={Number(initialLat)}
      initialLng={Number(initialLng)}
      initialLatExtent={initialLatExtent}
      initialLngExtent={initialLngExtent}
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
