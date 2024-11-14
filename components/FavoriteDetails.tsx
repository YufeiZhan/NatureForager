import React from "react";
import { SafeAreaView, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import { ThemedText, ThemedView, ThemedButton } from "../components/Themed";
import { Favorite } from "@/hooks/useFavorites";

interface FavoriteDetailsProps {
  favorite: Favorite;
  onClose: () => void;
}

export default function FavoriteDetails({ favorite, onClose}: FavoriteDetailsProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.favoriteName}>{favorite.name}</ThemedText>

          {/* Edit and Close Buttons */}
          <ThemedView style={styles.headerButtons}>
            <Pressable style={styles.iconButton}>
              <ThemedText>Edit</ThemedText>
            </Pressable>
            <Pressable onPress={onClose} style={styles.iconButton}>
              <ThemedText>Close</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>

        {/* Location Section */}
        <ThemedView style={styles.locationContainer}>
          <ThemedText>Location:</ThemedText>
          <ThemedText>
            {favorite.location.latitude.toFixed(2)}° N, {favorite.location.longitude.toFixed(2)}° W
          </ThemedText>
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
