import { useEffect, useState } from 'react';
import { Image, StyleSheet, Button } from 'react-native';
import { ThemedScrollView, ThemedView, ThemedText, ThemedButton } from '../components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';  // To capture iNaturalistID and for navigation
import { parse } from 'papaparse';

interface Plant {
  "iNaturalist ID": string;
  "Scientific Name": string;
  "Common Name": string;
  Type: string;
  "Month Ripe": string;
  Notes?: string;
}

// CSV data as a string
const csvData = `
iNaturalist ID,Scientific Name,Common Name,Type,Month Ripe,Notes
133686,Morchella angusticeps,Black Morel,mushroom,April,
55634,Allium tricoccum,Ramps,"leaf, root",April,
50829,Viola,Violet,"leaf, flower",April,species?
48502,Cercis canadensis,Redbud,flower,April,
60580,Forsythia,Forsythia,flower,April,species?
126583,Hemerocallis fulva,Daylily,"shoot, tuber",April,
75501,Arctium lappa,Greater Burdock,root,April,check leaves
59570,Arctium minus,Lesser Burdock,root,April,leaves
914922,Reynoutria japonica,Japanese Knotweed,shoot,April,
71136,Barbarea verna,Creasy Greens / Land Cress,leaf,April,
49652,Cardamine,Bittercress,"leaf, flower",April,all species in genus are edible
75371,Allium vineale,Onion Grass,"leaf, root",April,
51884,Urtica dioica,Stinging Nettle,leaf,April,
119802,Laportea canadensis,Wood Nettle,leaf,April,
47602,Taraxacum officinale,Dandelion,"leaf, flower",April,
55851,Lamium purpureum,Purple Dead Nettle,leaf,April,
48626,Oenothera,Evening Primrose,root,April,species?
81711,Hydrophyllum virginianum,Waterleaf,leaf,April,
130368,Osmorhiza longistylis,Aniseroot,"leaf, root, shoot",April,
130367,Osmorhiza claytonii,Hairy Sweet Cicely,"leaf, root, shoot",April,
116735,Rudbeckia laciniata,Cutleaf Coneflower,leaf,April,
49389,Stellaria,Chickweed,leaf,April,species?
53271,Brassica rapa,Field Mustard,leaf,April,
54516,Brassica oleracea,Wild Mustard,leaf,April,
56061,Alliaria petiolata,Garlic Mustard,"leaf, flower",April,
56057,Leucanthemum vulgare,Ox-Eye Daisy,"leaf, flower",April,stalk has some sort of toxicity
48494,Pleurotus ostreatus,Oyster Mushroom,mushroom,April,
117434,Claytonia virginica,Virginia Spring Beauty,"leaf, flower, root",April,
67775,Claytonia caroliniana,Carolina Spring Beauty,"leaf, flower, root",April,
130991,Tradescantia virginiana,Virginia Spiderwort,"leaf, flower, shoot",April,
54854,Tilia americana,Basswood,leaf,April,
85327,Polygonatum biflorum,Solomon's Seal,"leaf, shoot, root",April,
49157,Betula lenta,Sweet Birch,twig tea,April,
54793,Lindera benzoin,Spicebush,twig tea,April,
48241,Erythronium,Trout Lily ,"leaf, root",April,too many leaves can make you vomit
48686,Typha,Cattail,pollen,April,
`;

export default function PlantInfoModal() {
  const { iNaturalistID } = useLocalSearchParams();
  const [plantInfo, setPlantInfo] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();  // Router for navigation control

  useEffect(() => {
    const result = parse<Plant>(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    const matchedPlant = result.data.find(
      (plant) => plant["iNaturalist ID"] === iNaturalistID
    );

    if (matchedPlant) {
      setPlantInfo(matchedPlant);
    }
    console.log(matchedPlant);
    setLoading(false);
  }, [iNaturalistID]);

  if (loading) {
    return (
      <ThemedView>
        <ThemedText>Loading plant information...</ThemedText>
      </ThemedView>
    );
  }

  if (!plantInfo) {
    return (
      <ThemedView>
        <ThemedText>No plant information found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedScrollView>
        {/* Plant Image */}
        <ThemedView style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/300x200.png?text=Plant+Image' }}
            style={styles.image}
            resizeMode="cover"
          />
        </ThemedView>

        {/* Plant Details */}
        <ThemedView>
          <ThemedText>Common Name: {plantInfo["Common Name"]}</ThemedText>
          <ThemedText>Scientific Name: {plantInfo["Scientific Name"]}</ThemedText>
          <ThemedText>Type: {plantInfo.Type}</ThemedText>
          <ThemedText>Month Ripe: {plantInfo["Month Ripe"]}</ThemedText>
          {plantInfo.Notes && <ThemedText>Notes: {plantInfo.Notes}</ThemedText>}
        </ThemedView>
      </ThemedScrollView>
      
      {/* Close Button */}
      <ThemedButton title="Close" onPress={() => router.back()}/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
