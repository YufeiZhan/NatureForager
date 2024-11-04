import { ThemedText, ThemedView } from "@/components/Themed";
import { StyleSheet } from "react-native";
import Map from "@/components/Map";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { useNonArraySearchParams } from "@/hooks/useNonArraySearchParams";
import { Button } from "react-native";
import { RootStackParamList } from "../../../NavigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, "SpeciesInfoModal">;

export default function PlantLocation() {
  const { iNaturalistTaxonId, commonName } = useNonArraySearchParams();


  // change screen header to match common name
  const nav = useNavigation<ProfileScreenNavigationProp>();
  useEffect(() => {
    // Set screen header title and add a button to navigate to the PlantInfoModal
    nav.setOptions({
      title: commonName,
      headerRight: () => (
        <Button
          title="Species Info"
          onPress={() => nav.navigate("SpeciesInfoModal", { taxon_id: iNaturalistTaxonId })}
        />
      ),
    });
  }, [commonName, iNaturalistTaxonId]);

  return <Map iNaturalistTaxonId={iNaturalistTaxonId}></Map>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});