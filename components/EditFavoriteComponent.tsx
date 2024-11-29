import React, { useState, useRef } from "react";
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  ThemedText,
  ThemedTextInput,
  ThemedView,
  ThemedButton,
} from "./Themed";
import { Favorite } from "@/hooks/useFavorites";
import EditLocationModal from "@/components/EditLocationModal";
import * as ImagePicker from "expo-image-picker";

import MapView, { Marker } from "react-native-maps";

interface EditFavoriteProps {
  favorite: Favorite;
  setName: (name: string) => void;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
  setNote: (note: string) => void;
  setPhotoUrls: (photos: string[]) => void;
}

export default function EditFavoriteComponent({
  favorite,
  setName,
  setLatitude,
  setLongitude,
  setNote,
  setPhotoUrls,
}: EditFavoriteProps) {
  const [editLocationModalVisible, setEditLocationModalVisible] =
    useState(false);

  const [markerLocation, setMarkerLocation] = useState({
    latitude: favorite.location.latitude,
    longitude: favorite.location.longitude,
  });

  const mapRef = useRef<MapView>(null);

  const handleLocationChoice = (newLat: number, newLng: number) => {
    setMarkerLocation({ latitude: newLat, longitude: newLng });
    setLatitude(newLat);
    setLongitude(newLng);

    // Center the map on the new marker location
    mapRef.current?.animateToRegion(
      {
        latitude: newLat,
        longitude: newLng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      500
    ); // Duration in ms

    setEditLocationModalVisible(false);
  };

  // Remove a photo from the list
  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = favorite.photos ? [...favorite.photos] : [];
    updatedPhotos.splice(index, 1);
    setPhotoUrls(updatedPhotos);
  };

  // Add a new photo (dummy button)
  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) {
      const updatedPhotos = [...(favorite.photos ?? []), result.assets[0].uri];
      setPhotoUrls(updatedPhotos);
    }
  };

  const hasValidLocation =
    markerLocation.latitude !== 0 && markerLocation.longitude !== 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Editable Name */}
        <ThemedTextInput
          style={styles.nameInput}
          value={favorite.name}
          onChangeText={setName}
          placeholder="Favorite Name"
        />

        {/* Map Section with Editable Location */}
        <ThemedView style={styles.mapContainer}>
          {hasValidLocation ? (
            <View style={styles.mapWrapper}>
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: markerLocation.latitude,
                  longitude: markerLocation.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                {/* Marker at the selected location */}
                <Marker coordinate={markerLocation} />
              </MapView>
            </View>
          ) : (
            <ThemedText style={styles.noLocationText}>
              No location set yet
            </ThemedText>
          )}
          <View style={styles.editLocationButtonContainer}>
            <ThemedButton
              title="Edit"
              onPress={() => setEditLocationModalVisible(true)}
            />
          </View>
        </ThemedView>

        {/* Note Section */}
        <ThemedTextInput
          style={styles.noteInput}
          placeholder="Tap to add some note about this plant..."
          placeholderTextColor="white"
          multiline
          value={favorite.note}
          onChangeText={setNote}
        />

        {/* Photos Section */}
        <ThemedView style={styles.photosContainer}>
          <Pressable style={styles.addPhotoButton} onPress={handleAddPhoto}>
            <ThemedText style={styles.addPhotoText}>+</ThemedText>
          </Pressable>
          {favorite.photos?.map((photoUri, index) => (
            <View key={index} style={styles.photoWrapper}>
              <Image
                source={{ uri: photoUri }}
                style={styles.photo}
                resizeMode="cover"
              />
              <Pressable
                style={styles.removePhotoButton}
                onPress={() => handleRemovePhoto(index)}
              >
                <ThemedText style={styles.removePhotoText}>X</ThemedText>
              </Pressable>
            </View>
          ))}
        </ThemedView>

        {/* Edit Location Modal */}
        <EditLocationModal
          visible={editLocationModalVisible}
          latitude={favorite.location.latitude}
          longitude={favorite.location.longitude}
          onClose={() => setEditLocationModalVisible(false)}
          onConfirmLocation={handleLocationChoice}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  nameInput: {
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  mapContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  mapText: {
    marginBottom: 8,
  },
  mapWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 1,
  },
  editLocationButtonContainer: {
    position: "absolute",
    top: 3,
    right: 3,
    zIndex: 1,
    paddingVertical: 1,
    paddingHorizontal: 1,
    borderRadius: 8,
  },
  noLocationText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    padding: 20,
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
    color: "white",
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 16,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d3a15d",
    borderRadius: 5,
    marginRight: 8,
  },
  addPhotoText: {
    fontSize: 24,
    color: "#fff",
  },
  photoWrapper: {
    position: "relative",
    marginRight: 8,
    marginBottom: 8,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  removePhotoText: {
    color: "black",
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
