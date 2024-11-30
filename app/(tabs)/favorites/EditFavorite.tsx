import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemedButton } from "@/components/Themed";
import { useNonArraySearchParams } from "@/hooks/useNonArraySearchParams";
import EditFavoriteComponent from "@/components/EditFavoriteComponent";
import { Favorite } from "@/hooks/useFavorites";
import { FavoritesContext } from "@/hooks/FavoritesContext";

export default function EditFavoriteScreen() {
  const router = useRouter();
  const { removeFavorite, updateFavorite } = useContext(FavoritesContext);

  // Destructure parameters from the route and initialize state for each field
  const {
    id,
    iNaturalistId,
    name: nameParam,
    latitude: latitudeParam,
    longitude: longitudeParam,
    photos: photosParam,
    note: noteParam,
  } = useNonArraySearchParams();

  const [name, setName] = useState(nameParam || "");
  const [latitude, setLatitude] = useState(parseFloat(latitudeParam) || 0);
  const [longitude, setLongitude] = useState(parseFloat(longitudeParam) || 0);
  const [note, setNote] = useState(noteParam || "");
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    photosParam ? photosParam.split(",") : []
  );
  const parsedINaturalistId = iNaturalistId
    ? parseInt(iNaturalistId, 10)
    : undefined;

  // Construct the Favorite object based on current state
  const favorite: Favorite = {
    id,
    iNaturalistId: parsedINaturalistId,
    name,
    location: { latitude, longitude },
    photos: photoUrls,
    note,
  };

  // Handle the delete button
  const handleDelete = async () => {
    if (favorite.id) {
      await removeFavorite(favorite.id);
      router.back();
    } else {
      console.warn("No ID available to delete the favorite.");
    }
  };

  // Handle the update button
  const handleUpdate = async () => {
    if (!name) {
      alert("The plant name cannot be empty.");
      return;
    }
    await updateFavorite(favorite.id, {
      name,
      location: { latitude, longitude },
      photos: photoUrls,
      note,
    });
    router.back();
  };

  // Handle the cancel button
  const handleCancel = () => {
    router.back();
  };

  const handleNoteChange = (newNote: string) => {
    setNote(newNote);
  };

  const handlePhotoUrlsChange = (newPhotoUrls: string[]) => {
    setPhotoUrls(newPhotoUrls);
  };

  return (
    <View style={styles.container}>
      <EditFavoriteComponent
        favorite={favorite}
        setName={setName}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        setNote={handleNoteChange}
        setPhotoUrls={handlePhotoUrlsChange}
      />

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Delete"
          action="secondary"
          onPress={handleDelete}
        />
        <ThemedButton
          title="Cancel"
          action="secondary"
          onPress={handleCancel}
        />
        <ThemedButton title="Update" action="primary" onPress={handleUpdate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  deleteButton: {
    backgroundColor: "#f55",
  },
  cancelButton: {
    backgroundColor: "#888",
  },
  updateButton: {
    backgroundColor: "#4CAF50",
  },
});
