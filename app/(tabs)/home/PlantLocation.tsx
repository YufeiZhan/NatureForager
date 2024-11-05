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
  const { iNaturalistTaxonId, commonName } = useNonArraySearchParams();
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

  return (
    <>
      <Map
        iNaturalistTaxonId={iNaturalistTaxonId}
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
