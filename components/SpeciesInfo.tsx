import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  LogBox,
  TextProps,
  SafeAreaView,
} from "react-native";
import {
  ThemedScrollView,
  ThemedView,
  ThemedText,
  ThemedButton,
} from "../components/Themed";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import RenderHTML from "react-native-render-html";
import { ivoryWhite, oliveGreen, pureWhite } from "@/constants/Colors";
import plantData from "@/data/edible_plants.json";
import { ReminderSpecies, TempReminderSpecies } from "@/backend/Reminder";
import speciesData from "@/data/edible_plants.json";
import FrequencySelection from "./FrequencySelection";
import { View } from "react-native";

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

console.error = (error) => error.apply;

const aggregateSpecies = (data: any[]): TempReminderSpecies[] => {
  const speciesMap: { [key: number]: TempReminderSpecies & { monthsSet: Set<string> } } = {};

  data.forEach((item) => {
    const id = item["iNaturalist ID"];
    const month = item["Month Ripe"];
    const name = item["Common Name"];
    const type = item.Type;

    if (!speciesMap[id]) {
      speciesMap[id] = {
        id,
        name,
        type,
        monthRipe: month,
        monthsSet: new Set([month]),
        months: [],
      };
    } else {
      speciesMap[id].monthsSet.add(month);
    }
  });

  return Object.values(speciesMap).map(({ monthsSet, ...species }) => ({
    ...species,
    months: Array.from(monthsSet),
  }));
};

export default function SpeciesInfo({ taxonId }: { taxonId: string }) {
  const [plantInfo, setPlantInfo] = useState<Plant | null>(null);
  const [taxonData, setTaxonData] = useState<TaxonData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [edibleInfo, setEdibleInfo] = useState<ReminderSpecies | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const aggregatedData = aggregateSpecies(speciesData);
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

    const ediblePlant = aggregatedData.find((plant) => {
      return String(plant.id) === String(taxonId);
    });
    
    if (ediblePlant) {
      setEdibleInfo(ediblePlant);
    } else {
      console.error("No edible plant data found for this taxon.");
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

  const handleReminded = (species: ReminderSpecies) => {
    setIsModalVisible(true);
  };

  function handleCloseModal(): void {
    setIsModalVisible(false);
  }

  return (
    <>
      <ThemedScrollView contentContainerStyle={styles.mainContainer}>
        <ThemedScrollView contentContainerStyle={styles.subContainer}>
          <ThemedText style={styles.primaryTitle}>{taxonData?.common_name}</ThemedText>
          <ThemedText style={styles.secondaryTitle}>{taxonData?.scientific_name}</ThemedText>
          <View style={styles.divider}></View>

          <Image resizeMode="contain" source={require('../assets/icons/reminder-off.png')} style={styles.icon} />
          <ThemedButton title="Get Reminded" onPress={() => handleReminded(edibleInfo!)} />

          <ThemedText style={styles.secondaryTitle}>Months Ripe: {edibleInfo?.months.join(", ")}</ThemedText>
          <ThemedText style={styles.secondaryTitle}>PartsEdible: TBA</ThemedText>

          <ThemedView style={styles.imageContainer}>
            <Image
              source={{ uri: taxonData?.photo_url }}
              style={styles.image}
              resizeMode="cover"
            />
          </ThemedView>
            
          <ThemedView style = {{marginHorizontal: 20}}>
            <RenderHTML
                    contentWidth={width * 0.8}
                    source={{ html: taxonData?.wikipedia_summary || "" }}
                    // defaultTextProps={{ style: { color: pureWhite } }}
              />
          </ThemedView>

        </ThemedScrollView>
      </ThemedScrollView>

      {isModalVisible && edibleInfo && (
        <FrequencySelection
          species={{ ...edibleInfo, frequency: "" }}
          ifBack={false}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: oliveGreen
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: ivoryWhite,
    borderRadius: 20,
    opacity: 0.9
  },
  primaryTitle: {
    fontSize: 30,
    marginTop: 10
  },
  secondaryTitle: {
    fontSize: 18,
    marginVertical: 2,
    marginHorizontal: 5
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: oliveGreen,
    marginVertical: 10, 
  },
  icon: {
    width: 25,
    height: 20
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginVertical: 20
  },
});
