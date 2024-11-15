import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import { ThemedText, ThemedView, ThemedButton } from "../components/Themed";
import { Favorite } from "@/hooks/useFavorites";
import { useRouter } from "expo-router";

interface FavoriteDetailsProps {
  favorite: Favorite;
  onClose: () => void;
}

export default function FavoriteDetails({ favorite, onClose}: FavoriteDetailsProps) {
  const [city, setCity] = useState("Loading...");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const fetchLocationDetails = async (latitude : number, longitude : number) => {
    const GEO_API_KEY = "0fc7eb37c0ab4842a00ec10e9ec3661a";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${GEO_API_KEY}&language=${"en"}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
  
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { city, state, postcode } = data.results[0].components;
  
        return {
          city: city || "City not found",
          state: state || "State not found",
          zipCode: postcode || "Zip code not found"
        };
      } else {
        throw new Error('No results found for the given coordinates');
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
      pathname: "/(tabs)/profile/EditFavorite", // Adjust the path based on your file structure
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.favoriteName}>{favorite.name}</ThemedText>

          {/* Edit and Close Buttons */}
          <ThemedView style={styles.headerButtons}>
            <Pressable style={styles.iconButton} onPress={handleEditPress}>
              <ThemedText>Edit</ThemedText>
            </Pressable>
            <Pressable onPress={onClose} style={styles.iconButton}>
              <ThemedText>Close</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>

        {/* Location Section */}
        <ThemedView style={styles.locationContainer}>
          <ThemedText>{`${city}, ${state}`}</ThemedText>
          <ThemedText> {zipCode}</ThemedText>
        </ThemedView>

        {/* Note Section */}
        <ThemedView style={styles.noteContainer}>
          <ThemedText>{favorite.note || "No note available"}</ThemedText>
        </ThemedView>

        {/* Photos Section */}
        <ThemedView style={styles.photosContainer}>
          {favorite.photos && favorite.photos.length > 0 ? (
            favorite.photos.map((photoUri, index) => (
              <Image
                key={index}
                source={{ uri: photoUri }}
                style={styles.photo}
                resizeMode="cover"
              />
            ))
          ) : (
            <ThemedText>No photos available</ThemedText>
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
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
  favoriteName: {
    fontSize: 24,
    flex: 1,
  },
  headerButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
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
  },
  photo: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
});
