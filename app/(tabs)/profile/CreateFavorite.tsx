import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  ThemedText,
  ThemedView,
  ThemedButton,
} from "../../../components/Themed";
import { addPlantToFavorites, getFavorites } from "../../../backend/Favorites";
import uuid from "react-native-uuid";

export default function CreateFavorite() {
  const router = useRouter();
  const { plantId, commonName, location, photo } = useLocalSearchParams();
  const [note, setNote] = useState("");
  const stringLocation = location as string;

  useEffect(() => {
    setNote(""); // Reset note to empty when component mounts
  }, []);

  // Enhance photo quality
  const photoUri = typeof photo === "string" ? photo.replace("square", "large") : "";

  // Handle the create button click
  const handleCreateFavorite = async () => {
    // Prepare plant data
    const plantData = {
      iNatualistId: plantId as string,
      RandomlyGeneratedId: uuid.v4() as string,
      name: commonName as string,
      location: {
        latitude: Number(stringLocation?.split(",")[0]) || 0,
        longitude: Number(stringLocation?.split(",")[1]) || 0,
      },
      photos: [photoUri],
      note,
    };

    // Save plant data to favorites
    await addPlantToFavorites(plantData);

    const favorites = await getFavorites();
    console.log("All stored favorites:", favorites);

    // Navigate back after saving
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Common Name */}
      <ThemedText style={styles.commonName}>{commonName}</ThemedText>

      {/* Map Placeholder */}
      <ThemedView style={styles.mapContainer}>
        <ThemedText style={styles.mapText}>Location: {location}</ThemedText>
        <ThemedButton title="Edit" onPress={() => {}} />
      </ThemedView>

      {/* Photo */}
      <ThemedView style={styles.photoContainer}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.photo}
            resizeMode="cover"
          />
        ) : (
          <ThemedText>+ Add Photo(s)</ThemedText>
        )}
      </ThemedView>

      {/* Note Input */}
      <TextInput
        style={styles.noteInput}
        placeholder="Tap to add some note about this plant..."
        placeholderTextColor="white"
        multiline
        value={note}
        onChangeText={setNote}
      />

      {/* Cancel and Create Buttons */}
      <View style={styles.buttonContainer}>
        <ThemedButton title="Cancel" onPress={() => router.back()} />
        <ThemedButton title="Create" onPress={handleCreateFavorite} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  commonName: {
    textAlign: "center",
    paddingVertical: 8,
  },
  mapContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
    borderRadius: 8,
  },
  mapText: {
    marginBottom: 8,
  },
  photoContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginBottom: 16,
    borderRadius: 8,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  noteInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16,
    textAlignVertical: "top",
    color: "white"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
