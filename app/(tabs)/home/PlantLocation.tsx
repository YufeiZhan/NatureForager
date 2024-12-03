import INaturalistMap from "@/components/INaturalistMap";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useNonArraySearchParams } from "@/hooks/useNonArraySearchParams";
import { RootStackParamList } from "../../../NavigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { globalStyles } from "@/styles/globalStyles";
import SpeciesInfo from "@/components/SpeciesInfo";
import ObservationDetails from "@/components/ObservationDetails";
import { Observation } from "@/iNaturalistTypes";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

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

    // don't zoom in too much
    initialLatExtent = Math.max(0.001, initialLatExtent);
    initialLngExtent = Math.max(0.001, initialLngExtent);
  }

  // selected observation id
  const [selectedId, setSelectedId] = useState("");

  // ref for the bottom sheet
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const snapTo = (index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  };
  // observation detail if pin clicked
  const [observationDetail, setObservationDetail] =
    useState<Observation | null>(null);

  const selectObservation = (obs: Observation) => {
    setObservationDetail(obs);
    snapTo(1);
    setSelectedId(obs.id ? String(obs.id) : "");
  };
  const deselectObservation = () => {
    setObservationDetail(null);
    setSelectedId("");
  };

  // close bottom sheet if taxon changed, don't want old observation details to remain
  useEffect(deselectObservation, [iNaturalistTaxonId]);

  return (
    <>
      <INaturalistMap
        iNaturalistTaxonId={iNaturalistTaxonId}
        initialLat={Number(initialLat)}
        initialLng={Number(initialLng)}
        initialLatExtent={initialLatExtent}
        initialLngExtent={initialLngExtent}
        selectedMarkerId={selectedId}
        onPressObservation={selectObservation}
        onPressMapBackground={deselectObservation}
      />
      <BottomSheet
        ref={bottomSheetRef}
        backgroundStyle={globalStyles.bottomSheet}
        enableDynamicSizing={false}
        snapPoints={["5%", "35%", "100%"]}
        index={1} //initialize to the second snappoint
      >
        <BottomSheetScrollView
          contentContainerStyle={globalStyles.infoPageSubContainer}
        >
          <SpeciesInfo
            taxonId={iNaturalistTaxonId}
            hide={Boolean(observationDetail)}
          />
          {observationDetail && (
            <ObservationDetails
              observation={observationDetail}
              onCloseDetails={deselectObservation}
            ></ObservationDetails>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}
