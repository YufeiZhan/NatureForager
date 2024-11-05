import { ThemedText, ThemedView } from "@/components/Themed";
import { StyleSheet, Modal } from "react-native";
import Map from "@/components/Map";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useNonArraySearchParams } from "@/hooks/useNonArraySearchParams";
import { Button } from "react-native";
import { RootStackParamList } from "../../../NavigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import ObservationDetails from "@/components/ObservationDetails";
import { Observation } from "@/iNaturalistTypes";

type ProfileScreenNavigationProp = StackNavigationProp<
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

  const [modalVisible, setModalVisible] = useState(false);
  const [modalObservation, setModalObservation] = useState<
    Observation | undefined
  >();

  // change screen header to match common name
  const nav = useNavigation<ProfileScreenNavigationProp>();
  useEffect(() => {
    // Set screen header title and add a button to navigate to the modal containing species info
    // Here instead of in main navigation because it updates based on this page's iNaturalistTaxonId
    nav.setOptions({
      title: commonName,
      headerRight: () => (
        <Button
          title="Info"
          onPress={() =>
            nav.navigate("SpeciesInfoModal", { taxonId: iNaturalistTaxonId })
          }
        />
      ),
    });
  }, [commonName, iNaturalistTaxonId]);

  const openDetailsModal = (observation: Observation) => {
    setModalObservation(observation);
    setModalVisible(true);
  };

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
      <Map
        iNaturalistTaxonId={iNaturalistTaxonId}
        initialLat={Number(initialLat)}
        initialLng={Number(initialLng)}
        initialLatExtent={initialLatExtent}
        initialLngExtent={initialLngExtent}
        onINaturalistMarkerPress={openDetailsModal}
      ></Map>
      <Modal visible={modalVisible} animationType="slide">
        {modalObservation && (
          <ObservationDetails
            observation={modalObservation}
            onClose={() => setModalVisible(false)}
          ></ObservationDetails>
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
