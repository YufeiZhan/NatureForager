import INaturalistMap from "@/components/INaturalistMap";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useNonArraySearchParams } from "@/hooks/useNonArraySearchParams";
import { RootStackParamList } from "../../../NavigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import BottomSheet from "@gorhom/bottom-sheet";
import { globalStyles } from "@/styles/globalStyles";
import SpeciesInfo from "@/components/SpeciesInfo";
import ObservationDetails from "@/components/ObservationDetails";
import { Observation } from "@/iNaturalistTypes";

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
    // nav.setOptions({
    //   title: commonName,
    //   headerRight: () => (
    //     <Pressable onPress={() =>
    //       nav.navigate("SpeciesInfoModal", { taxonId: iNaturalistTaxonId })
    //     }>
    //         <Icon name="info-circle" size={20} color="white"/>
    //     </Pressable>

    //   ),
    // });
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

  // obaservation detail if pin clicked
  const [observationDetail, setObservationDetail] = useState<Observation | null>(null)
  return (
    <>
      <INaturalistMap
        iNaturalistTaxonId={iNaturalistTaxonId}
        initialLat={Number(initialLat)}
        initialLng={Number(initialLng)}
        initialLatExtent={initialLatExtent}
        initialLngExtent={initialLngExtent}
        updateBottomSheet ={(obs) => setObservationDetail(obs)}
      />
      <BottomSheet
        backgroundStyle={globalStyles.bottomSheet}
        enableDynamicSizing={false}
        snapPoints={["5%", "35%", "100%"]}
        index={0} //initialize to the first snappoint
      > 
        { observationDetail 
          ? <ObservationDetails
              observation={observationDetail}
              updateBottomSheet ={() => setObservationDetail(null)}
              ></ObservationDetails>
          : <SpeciesInfo taxonId={iNaturalistTaxonId} />
        }
        
      </BottomSheet>
    </>
  );
}
