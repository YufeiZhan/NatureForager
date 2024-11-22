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
import { globalStyles } from "@/styles/globalStyles";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

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
    <SafeAreaView style={globalStyles.infoPageContainer}>
        <ThemedScrollView contentContainerStyle={globalStyles.infoPageSubContainer}>
          <ThemedText style={globalStyles.infoPrimaryTitle}>{observation.taxon?.preferred_common_name}</ThemedText>
          <ThemedText style={globalStyles.infoSecondaryTitle}>{observation.taxon?.name}</ThemedText>
          <ThemedView style={globalStyles.divider} />
          <Image resizeMode="contain" source={require('../assets/icons/favorite-off.png')} style={globalStyles.icon} />
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

          <ThemedText style={globalStyles.infoUnderlinedTitle}>Observed on</ThemedText>
          <ThemedText style={globalStyles.infoSecondaryTitle}>{observation.observed_on || "Date Not Available"}</ThemedText>

          { observation.photos && observation.photos.length > 0 
            ? (observation.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo.url?.replace("square", "medium") }}
                  style={[
                    globalStyles.image,
                    { width: width * 0.9, height: width * 0.9 },
                  ]}
                />))) 
            : (<ThemedText>No photos available</ThemedText>)
          }

        </ThemedScrollView>

      <ThemedButton title="Back to Map" onPress={onClose} action="secondary" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
