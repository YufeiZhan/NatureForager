import { useEffect, useState } from "react";
import { useWindowDimensions, LogBox, ActivityIndicator } from "react-native";
import {
  ThemedView,
  ThemedText,
  ThemedIcon,
  ThemedImage,
} from "../components/Themed";
import RenderHTML from "react-native-render-html";
import plantData from "@/data/edible_plants.json";
import {
  loadReminders,
  ReminderSpecies,
  TempReminderSpecies,
} from "@/backend/Reminder";
import speciesData from "@/data/edible_plants.json";
import FrequencySelection from "./FrequencySelection";
import { globalStyles } from "@/styles/globalStyles";
import { darkGreen } from "@/constants/Colors";

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
  const speciesMap: {
    [key: number]: TempReminderSpecies & {
      monthsSet: Set<string>;
      typesSet: Set<string>;
    };
  } = {};

  data.forEach((item) => {
    const id = item["iNaturalist ID"];
    const month = item["Month Ripe"];
    const name = item["Common Name"];
    const type = item.Type;

    const typeArray = type.split(",").map((t: string) => t.trim());

    if (!speciesMap[id]) {
      speciesMap[id] = {
        id,
        name,
        type,
        monthRipe: month,
        monthsSet: new Set([month]),
        typesSet: new Set([type]),
        months: [],
      };
    } else {
      speciesMap[id].monthsSet.add(month);
      typeArray.forEach((t: string) => speciesMap[id].typesSet.add(t));
    }
  });

  return Object.values(speciesMap).map(
    ({ monthsSet, typesSet, ...species }) => ({
      ...species,
      months: Array.from(monthsSet),
      type: Array.from(typesSet).join(", "),
    })
  );
};

export default function SpeciesInfo({
  taxonId,
  hide = false,
}: {
  taxonId: string;
  hide?: boolean;
}) {
  // note "hide" is for not displaying this component while not unmounting it
  // this avoids needing to re-fetch iNaturalist data / show an activity indicator

  const [plantInfo, setPlantInfo] = useState<Plant | null>(null);
  const [taxonData, setTaxonData] = useState<TaxonData | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [edibleInfo, setEdibleInfo] = useState<ReminderSpecies | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReminded, setIsReminded] = useState(false);

  useEffect(() => {
    const aggregatedData = aggregateSpecies(speciesData);
    // Find the plant by taxonId from the local JSON data
    const matchedPlant = plantData.find((plant) => {
      return String(plant["iNaturalist ID"]) === String(taxonId);
    });
    // console.log("matched:", matchedPlant);

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
        // console.log("taxon:",taxon);

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

  useEffect(() => {
    async function getReminder() {
      const result = await loadReminders();
      const reminded =
        result.filter((item) => item.name === plantInfo?.["Common Name"])
          .length > 0;
      setIsReminded(reminded);
    }

    getReminder();
  });

  const handleReminded = (species: ReminderSpecies) => {
    setIsModalVisible(true);
  };

  function handleCloseModal(): void {
    setIsModalVisible(false);
  }

  // if just hiding this component, don't unmount it (so don't have to refetch)
  if (hide) {
    return <></>;
  }

  if (loading) {
    return (
      <ActivityIndicator
        color={darkGreen}
        size="large"
        style={{ marginTop: 50 }}
      />
    );
  }

  return (
    <>
      <ThemedText style={globalStyles.infoPrimaryTitle}>
        {taxonData?.common_name}
      </ThemedText>
      <ThemedText
        style={[globalStyles.infoSecondaryTitle, { fontStyle: "italic" }]}
      >
        {taxonData?.scientific_name}
      </ThemedText>
      <ThemedView style={globalStyles.divider}></ThemedView>
      {isReminded ? (
        <ThemedIcon iconName="reminded"></ThemedIcon>
      ) : (
        <ThemedIcon
          iconName="unreminded"
          onPress={() => handleReminded(edibleInfo!)}
        ></ThemedIcon>
      )}

      <ThemedView style={globalStyles.secondaryGroup}>
        <ThemedText style={globalStyles.infoUnderlinedTitle}>
          Months Ripe
        </ThemedText>
        <ThemedText style={globalStyles.infoSecondaryTitle}>
          {edibleInfo?.months.join(", ")}
        </ThemedText>
      </ThemedView>
      <ThemedView style={globalStyles.secondaryGroup}>
        <ThemedText style={globalStyles.infoUnderlinedTitle}>
          Parts Edible
        </ThemedText>
        <ThemedText style={globalStyles.infoSecondaryTitle}>
          {edibleInfo?.type}
        </ThemedText>
      </ThemedView>

      <ThemedImage uri={taxonData?.photo_url} />

      <ThemedView style={globalStyles.html}>
        <RenderHTML
          contentWidth={width}
          source={{ html: taxonData?.wikipedia_summary || "" }}
        />
      </ThemedView>

      {isModalVisible && edibleInfo && (
        <FrequencySelection
          species={{ ...edibleInfo, frequency: "", imageURL: "" }}
          ifBack={false}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
