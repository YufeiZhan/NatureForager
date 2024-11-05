import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  LogBox,
  TextProps,
} from "react-native";
import {
  ThemedScrollView,
  ThemedView,
  ThemedText,
  ThemedButton,
} from "../components/Themed";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import RenderHTML from "react-native-render-html";
import { oliveGreen, pureWhite } from "@/constants/Colors";
import plantData from "@/data/edible_plants.json";

type Plant = (typeof plantData)[number];

interface TaxonData {
  common_name: string;
  scientific_name: string;
  wikipedia_summary: string;
  photo_url: string;
}

LogBox.ignoreLogs([
  "TRenderEngineProvider: Support for defaultProps will be removed",
  "MemoizedTNodeRenderer: Support for defaultProps will be removed",
  "TNodeChildrenRenderer: Support for defaultProps will be removed",
]);

export default function PlantInfoModal() {
  const { taxonId } = useLocalSearchParams();
  const [plantInfo, setPlantInfo] = useState<Plant | null>(null);
  const [taxonData, setTaxonData] = useState<TaxonData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { width } = useWindowDimensions();

  // change screen header to match common name
  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({ title: plantInfo?.["Common Name"] });
    // clean up once done
    return () => nav.setOptions({ title: "" });
  }, [plantInfo]);

  useEffect(() => {
    // Find the plant by taxonId from the local JSON data
    const matchedPlant = plantData.find((plant) => {
      return String(plant["iNaturalist ID"]) === String(taxonId);
    });
    // console.log(matchedPlant);

    if (matchedPlant) {
      setPlantInfo(matchedPlant);
    } else {
      console.error("No plant data found for this taxon.");
    }

    // Fetch taxon details from iNaturalist API
    const fetchTaxonData = async () => {
      try {
        const response = await fetch(
          `https://api.inaturalist.org/v1/taxa/${taxonId}`
        );
        const data = await response.json();
        const taxon = data.results[0];
        // console.log(response);

        const displayCommonName =
          matchedPlant?.["Common Name"] ||
          taxon.preferred_common_name ||
          "No common name";

        setTaxonData({
          common_name: displayCommonName,
          scientific_name: taxon.name,
          wikipedia_summary: taxon.wikipedia_summary || "No summary available",
          photo_url:
            taxon.taxon_photos[0]?.photo.medium_url ||
            "https://via.placeholder.com/300x200.png?text=Image+Not+Available",
        });
      } catch (error) {
        console.error("Error fetching plant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxonData();
  }, [taxonId]);

  if (loading) {
    return (
      <ThemedScrollView contentContainerStyle={styles.mainContainer}>
        <ThemedText>Loading plant information...</ThemedText>
      </ThemedScrollView>
    );
  }

  return (
    <ThemedScrollView contentContainerStyle={styles.mainContainer}>
      <ThemedView style={styles.imageContainer}>
        <Image
          source={{ uri: taxonData?.photo_url }}
          style={styles.image}
          resizeMode="cover"
        />
      </ThemedView>

      <ThemedView>
        <ThemedText>Common Name: {taxonData?.common_name}</ThemedText>
        <ThemedText>
          Scientific Name:{" "}
          <ThemedText style={{ fontStyle: "italic" }}>
            {taxonData?.scientific_name}
          </ThemedText>
        </ThemedText>
      </ThemedView>

      <ThemedView>
        <ThemedView>
          <RenderHTML
            contentWidth={width}
            source={{ html: taxonData?.wikipedia_summary || "" }}
            // defaultTextProps={{ style: { color: pureWhite } }}
          />
        </ThemedView>
      </ThemedView>

      <ThemedButton title="Back to Map" onPress={() => router.back()} />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    gap: 20,
    padding: 20,
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
});
