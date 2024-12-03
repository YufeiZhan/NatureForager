import { Image, StyleSheet } from "react-native";
import {
  ThemedScrollView,
  ThemedView,
  ThemedText,
  ThemedIcon,
  ThemedImage,
} from "./Themed";
import { Observation } from "../iNaturalistTypes";
import { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { globalStyles } from "@/styles/globalStyles";

interface ObservationDetailsProps {
  observation: Observation;
  onClose: () => void;
}

export default function ObservationDetails({
  observation,
  onClose,
}: ObservationDetailsProps) {
  // keep track of whether this observation is favorited
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
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
      name:
        observation.taxon?.preferred_common_name ||
        observation.taxon?.name ||
        "Unknown",
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

  const handleRemoveFavorites = async() => {
    const target_id = favorites?.filter((fav) => fav.iNaturalistId === observation.id)[0].id
    if (target_id) {
      await removeFavorite(target_id);
      setIsFavorited(false);
    } else {
      console.warn("No ID available to delete the favorite.");
    }
  }

  return (
    <>
      <ThemedView style={globalStyles.closeBottomSheetButton}>
        <ThemedIcon iconName="x" onPress={onClose} />
      </ThemedView>

      <ThemedText style={globalStyles.infoPrimaryTitle}>
        {observation.taxon?.preferred_common_name}
      </ThemedText>
      <ThemedText style={globalStyles.infoSecondaryTitle}>
        {observation.taxon?.name}
      </ThemedText>
      <ThemedView style={globalStyles.divider} />

      {/* Add to Favorite Button or Favorited Text */}
      {!isFavorited ? (
        <ThemedIcon
          iconName="unfav"
          onPress={handleAddToFavorites}
        ></ThemedIcon>
      ) : (
        <ThemedIcon iconName="fav" onPress={handleRemoveFavorites}></ThemedIcon> //Q: allow user to unfav here?
      )}

      <ThemedText style={globalStyles.infoUnderlinedTitle}>
        Observed on
      </ThemedText>
      <ThemedText style={globalStyles.infoSecondaryTitle}>
        {observation.observed_on || "Date Not Available"}
      </ThemedText>

      <ThemedView style={styles.photosContainer}>
        {observation.photos && observation.photos.length > 0 ? (
          observation.photos.map((photo, index) => (
            <ThemedImage
              key={index}
              uri={photo.url?.replace("square", "medium")}
            />
          ))
        ) : (
          <ThemedText>No photos available</ThemedText>
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  photosContainer: {
    width: "100%",
    gap: 20,
  },
});
