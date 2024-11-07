import {
  Image,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import {
  ThemedScrollView,
  ThemedView,
  ThemedText,
  ThemedButton,
} from "../components/Themed";
import { Observation } from "../iNaturalistTypes";
import { useRouter } from "expo-router";


interface ObservationDetailsProps {
  observation: Observation;
  onClose: () => void;
}

export default function ObservationDetails({
  observation,
  onClose,
}: ObservationDetailsProps) {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const handleAddToFavorites = () => {
    onClose();
    console.log(observation.id);
    router.push({
      pathname: "/(tabs)/profile/CreateFavorite",
      params: {
        plantId: observation.id,
        commonName: observation.taxon?.preferred_common_name,
        location: observation.location,
        photo: observation.photos?.[0].url ?? '',
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedScrollView>
        {/* Header with common name */}
        <ThemedView style={styles.headerContainer}>
          <ThemedText style={styles.header}>
            {observation.taxon?.preferred_common_name || "Observation Details"}
          </ThemedText>
        </ThemedView>

        {/* Observation Date and Note */}
        <ThemedView style={styles.detailsContainer}>
          <ThemedText>
            Observed on: {observation.observed_on || "Date not available"}
          </ThemedText>
          <ThemedText>{observation.description || ""}</ThemedText>
        </ThemedView>

        {/* Add to Favorite Button */}
        <ThemedButton title="Add to Favorites" onPress={handleAddToFavorites} />

        {/* Photos */}
        <ThemedView style={styles.photoContainer}>
          {observation.photos && observation.photos.length > 0 ? (
            observation.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo.url?.replace("square", "medium") }}
                style={[
                  styles.photo,
                  { width: width - 32, height: width - 32 },
                ]}
                resizeMode="cover"
              />
            ))
          ) : (
            <ThemedText>No photos available</ThemedText>
          )}
        </ThemedView>
      </ThemedScrollView>
      <ThemedButton title="Back to Map" onPress={onClose} />
      <ThemedText></ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    fontStyle: "italic",
  },
  detailsContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  photoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  photo: {
    marginVertical: 10,
    borderRadius: 10,
  },
});
