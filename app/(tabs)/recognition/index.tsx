import React, { useContext } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { ThemedButton, ThemedText, ThemedView } from "@/components/Themed";
import { FavoritesContext } from "@/hooks/FavoritesContext";

export default function ClearFavoritesScreen() {
  const { clearAllFavorites } = useContext(FavoritesContext);

  // Confirm and clear all favorites
  const handleClearFavorites = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete all favorite items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            await clearAllFavorites();
            Alert.alert("Favorites Cleared", "All favorite items have been deleted.");
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Clear All Favorites</ThemedText>
      <ThemedText style={styles.description}>
        This will delete all your favorite plants from storage. This action cannot be undone.
      </ThemedText>
      <ThemedButton
        title="Delete All Favorites"
        onPress={handleClearFavorites}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#f55",
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
  },
});
