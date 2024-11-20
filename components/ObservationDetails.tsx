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
} from "./Themed";
import { Observation } from "../iNaturalistTypes";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "@/hooks/FavoritesContext";

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

  // keep track of whether this observation is favorited
  const { favorites, addFavorite  } = useContext(FavoritesContext);
  const [isFavorited, setIsFavorited] = useState(false);
  useEffect(() => {
    const isInFavorites = Boolean(
      observation.id &&
        favorites &&
        favorites.some((fav) => fav.iNaturalistId === observation.id)
    );
    setIsFavorited(isInFavorites);
  }, [observation, favorites]);

  const handleAddToFavorites = async () => {
    // Construct the favorite object based on the observation data
    const favorite = {
      iNaturalistId: observation.id,
      name: observation.taxon?.preferred_common_name || observation.taxon?.name || "Unknown",
      location: {
        latitude: parseFloat(observation.location?.split(",")[0] || "0"),
        longitude: parseFloat(observation.location?.split(",")[1] || "0"),
      },
      photos: observation.photos?.map(
        (p) => p.url?.replace("square", "medium") || ""
      ),
      note: observation.description,
    };

    // Add the favorite to the context
    await addFavorite(favorite);

    // Update UI to reflect favorited state
    setIsFavorited(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedScrollView>
        {/* Header with common name */}
        <ThemedView style={styles.headerContainer}>
          <ThemedText style={styles.commonName}>
            {observation.taxon?.preferred_common_name || "Observation Details"}
          </ThemedText>
          <ThemedText style={styles.scientificName}>
            {observation.taxon?.name}
          </ThemedText>
        </ThemedView>

        {/* Observation Date and Note */}
        <ThemedView style={styles.detailsContainer}>
          <ThemedText>
            Observed on: {observation.observed_on || "Date not available"}
          </ThemedText>
          <ThemedText>{observation.description || ""}</ThemedText>
        </ThemedView>

        {/* Add to Favorite Button or Favorited Text */}
        {!isFavorited ? (
          <ThemedButton
            title="Add to Favorites"
            onPress={handleAddToFavorites}
          />
        ) : (
          <ThemedView style={styles.favoritedTextContainer}>
            <ThemedText style={styles.favoritedText}>Favorited!</ThemedText>
          </ThemedView>
        )}

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
      <ThemedButton title="Back to Map" onPress={onClose} action="secondary" />
      <ThemedText></ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  commonName: {
    fontSize: 24,
    textAlign: "center",
  },
  scientificName: {
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
  favoritedTextContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  favoritedText: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
});
