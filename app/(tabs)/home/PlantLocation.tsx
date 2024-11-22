import { StyleSheet } from "react-native";
import INaturalistMap from "@/components/INaturalistMap";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { useNonArraySearchParams } from "@/hooks/useNonArraySearchParams";
import { RootStackParamList } from "../../../NavigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import BottomSheet from "@gorhom/bottom-sheet";
import { yellowSand } from "@/constants/Colors";
import SpeciesInfo from "@/components/SpeciesInfo";

type SpeciesInfoNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpeciesInfoModal"
>;

export default function PlantLocation() {
  const {
    iNaturalistTaxonId,
    commonName,
    initialLat,
    initialLng,
    distanceKmToNearest,
  } = useNonArraySearchParams();

  // change screen header to match common name
  const nav = useNavigation<SpeciesInfoNavigationProp>();
  useEffect(() => {
    // Here instead of in main navigation because it updates based on this page's iNaturalistTaxonId
    nav.setOptions({ title: commonName });
  }, [commonName, iNaturalistTaxonId]);

  // calculate rough lat/lng extent based on distance to nearest observation, default to 0.05
  let initialLatExtent = 0.05;
  let initialLngExtent = 0.05;
  if (!isNaN(Number(distanceKmToNearest)) && !isNaN(Number(initialLat))) {
    const kmPerDegLat = 40000 / 360; // circumference of earth is 40000 km
    const degLatToNearest = Number(distanceKmToNearest) / kmPerDegLat;
    initialLatExtent = 4 * degLatToNearest;

    const latRadians = (Math.PI * Number(initialLat)) / 180;
    const circumKmAtLatitude = 40000 * Math.cos(latRadians);
    const kmPerDegLng = circumKmAtLatitude / 360;
    const degLngToNearest = Number(distanceKmToNearest) / kmPerDegLng;
    initialLngExtent = 4 * degLngToNearest;
  }

  return (
    <>
      <INaturalistMap
        iNaturalistTaxonId={iNaturalistTaxonId}
        initialLat={Number(initialLat)}
        initialLng={Number(initialLng)}
        initialLatExtent={initialLatExtent}
        initialLngExtent={initialLngExtent}
      />
      <BottomSheet
        backgroundStyle={styles.bottomSheet}
        enableDynamicSizing={false}
        snapPoints={["5%", "35%", "100%"]}
        index={1}
      >
        <SpeciesInfo taxonId={iNaturalistTaxonId} />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSheet: {
    backgroundColor: yellowSand,
  },
});
