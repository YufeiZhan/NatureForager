import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import {
  ThemedText,
  ThemedView,
  ThemedButton,
  ThemedImage,
  ThemedIcon,
} from "../components/Themed";
import { Favorite } from "@/hooks/useFavorites";
import { useRouter } from "expo-router";
import { globalStyles } from "@/styles/globalStyles";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

interface FavoriteDetailsProps {
  favorite: Favorite;
  onClose: () => void;
}

export default function FavoriteDetails({
  favorite,
  onClose,
}: FavoriteDetailsProps) {
  const [city, setCity] = useState("Loading...");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const fetchLocationDetails = async (latitude: number, longitude: number) => {
    const GEO_API_KEY = "0fc7eb37c0ab4842a00ec10e9ec3661a";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${GEO_API_KEY}&language=${"en"}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { city, state, postcode } = data.results[0].components;

        return {
          city: city || "City not found",
          state: state || "State not found",
          zipCode: postcode || "Zip code not found",
        };
      } else {
        throw new Error("No results found for the given coordinates");
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      return { city: "N/A", state: "N/A", zipCode: "N/A" };
    }
  };

  useEffect(() => {
    // Fetch location details on mount and update the state
    const getLocationInfo = async () => {
      try {
        const locationDetails = await fetchLocationDetails(
          favorite.location.latitude,
          favorite.location.longitude
        );
        setCity(locationDetails.city);
        setState(locationDetails.state);
        setZipCode(locationDetails.zipCode);
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    };

    getLocationInfo();
  }, [favorite.location.latitude, favorite.location.longitude]);

  const router = useRouter();

  // Function to handle edit button press, redirecting to the EditFavorite screen
  const handleEditPress = () => {
    router.push({
      pathname: "/(tabs)/favorites/EditFavorite", // Adjust the path based on your file structure
      params: {
        id: favorite.id,
        iNaturalistId: favorite.iNaturalistId,
        name: favorite.name,
        latitude: favorite.location.latitude.toString(),
        longitude: favorite.location.longitude.toString(),
        photos: favorite.photos ? favorite.photos.join(",") : "",
        note: favorite.note || "",
      },
    });
  };

  return (
    <>
      <BottomSheetScrollView
        contentContainerStyle={globalStyles.infoPageSubContainer}
      >
        {/* Header Section */}
        <ThemedText style={globalStyles.infoPrimaryTitle}>
          {favorite.name}
        </ThemedText>
        <ThemedView style={globalStyles.divider} />
        <ThemedIcon iconName="edit" onPress={handleEditPress}></ThemedIcon>

        {/* Location Section */}
        <ThemedText
          style={globalStyles.infoPrimaryTitle}
        >{`${city}, ${state}`}</ThemedText>
        <ThemedText
          style={globalStyles.infoSecondaryTitle}
        >{`(${zipCode})`}</ThemedText>

        {/* Note Section */}
        <ThemedView style={globalStyles.note}>
          <ThemedText>{favorite.note || "No note available"}</ThemedText>
        </ThemedView>

        {/* Photos Section */}
        <ThemedView style={styles.photosContainer}>
          {favorite.photos && favorite.photos.length > 0 ? (
            favorite.photos.map((photoUri, index) => (
              <ThemedImage key={index} uri={photoUri} />
            ))
          ) : (
            <ThemedText>No photos available</ThemedText>
          )}
        </ThemedView>
      </BottomSheetScrollView>
      <ThemedButton
        style={globalStyles.flowingButton}
        title="Back"
        onPress={onClose}
        action="primary"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  noteContainer: {
    width: "100%",
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0", // Placeholder for styling
  },
  photosContainer: {
    width: "100%",
    gap: 20,
  },
  photo: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
});
