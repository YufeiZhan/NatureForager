import { useEffect, useState } from 'react';
import { Image, StyleSheet, Pressable, useWindowDimensions, LogBox, TextProps } from 'react-native';
import { ThemedScrollView, ThemedView, ThemedText, ThemedButton } from '../components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RenderHTML from 'react-native-render-html';
import { oliveGreen, pureWhite } from "@/constants/Colors";


interface Plant {
  "iNaturalist ID": string;
  "Scientific Name": string;
  "Common Name": string;
  Type: string;
  "Month Ripe": string;
  Notes?: string;
}

interface TaxonData {
  common_name: string;
  scientific_name: string;
  wikipedia_summary: string;
  photo_url: string;
}

interface Photo {
  url: string;
}

LogBox.ignoreLogs([
  'TRenderEngineProvider: Support for defaultProps will be removed',
  'MemoizedTNodeRenderer: Support for defaultProps will be removed',
  'TNodeChildrenRenderer: Support for defaultProps will be removed',
]);

const plantData: Plant[] = require('../data/edible_plants.json');

function ModalText(props: TextProps) {
  return <ThemedText style={[{ color: pureWhite, marginLeft: 16}, props.style]} {...props} />;
}

export default function PlantInfoModal() {
  const { taxon_id } = useLocalSearchParams();
  console.log(taxon_id);
  const [plantInfo, setPlantInfo] = useState<Plant | null>(null);
  const [taxonData, setTaxonData] = useState<TaxonData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { width } = useWindowDimensions();

  useEffect(() => {
    // Find the plant by taxon_id from the local JSON data
    const matchedPlant = plantData.find((plant) => {
      return String(plant["iNaturalist ID"]) === String(taxon_id)}
    );
    // console.log(matchedPlant);

    if (matchedPlant) {
      setPlantInfo(matchedPlant);
    } else {
      console.error('No plant data found for this taxon.');
    }

    // Fetch taxon details from iNaturalist API
    const fetchTaxonData = async () => {
      try {
        const response = await fetch(`https://api.inaturalist.org/v1/taxa/${taxon_id}`);
        const data = await response.json();
        const taxon = data.results[0];
        // console.log(response);
        
        setTaxonData({
          common_name: taxon.preferred_common_name || 'No common name',
          scientific_name: taxon.name,
          wikipedia_summary: taxon.wikipedia_summary || 'No summary available',
          photo_url: taxon.taxon_photos[0]?.photo.medium_url || 'https://via.placeholder.com/300x200.png?text=Image+Not+Available',
        });
        // console.log(taxonSummary);
      } catch (error) {
        console.error('Error fetching plant data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxonData();
  }, [taxon_id]);

  if (loading) {
    return (
      <ThemedView>
        <ModalText>Loading plant information...</ModalText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedScrollView>
        <ThemedView style={styles.headerContainer}>
          <ModalText style={styles.header}>{taxonData?.common_name || "Plant Info"}</ModalText>
        </ThemedView>
        
        <ThemedView style={styles.imageContainer}>
          <Image
            source={{ uri: taxonData?.photo_url }}
            style={styles.image}
            resizeMode="cover"
          />
        </ThemedView>

        <ThemedView>
          <ModalText>Common Name: {taxonData?.common_name}</ModalText>
          <ModalText style={{ fontStyle: "italic", color: pureWhite, marginLeft: 16 }}>Scientific Name: {taxonData?.scientific_name}</ModalText>

          <ThemedView style={styles.section}>
            <RenderHTML
              contentWidth={width}
              source={{ html: taxonData?.wikipedia_summary || "" }}
              defaultTextProps={{ style: { color: pureWhite } }}
            />
          </ThemedView>
        </ThemedView>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <ModalText>Back to Map</ModalText>
        </Pressable>
      </ThemedScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  closeButton: {
    color: "blue",
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    color: pureWhite,
    textAlign: 'center',
    marginVertical: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  section: {
    padding: 16,
  },
});
