import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export interface Favorite {
  id: string;
  iNaturalistId?: number;
  name: string;
  location: { latitude: number; longitude: number };
  photos?: string[];
  note?: string;
}

const FAVORITES_KEY = "@favorite_plants";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[] | undefined>();

  // load favorites from async storage
  useEffect(() => {
    loadFavorites();
  }, []);

  // CRUD operations ---------------------------------------

  const loadFavorites = async () => {
    try {
      const storedPlants = await AsyncStorage.getItem(FAVORITES_KEY);
      setFavorites(storedPlants ? JSON.parse(storedPlants) : []);
    } catch (error) {
      console.error("Error fetching favorite plants:", error);
      setFavorites([]);
    }
  };

  const addFavorite = async (plantData: Omit<Favorite, "id">) => {
    if (!favorites) return;
    try {
      // Check for duplicate iNaturalist observation
      const exists = favorites.some(
        (plant) =>
          plant.iNaturalistId && plant.iNaturalistId === plantData.iNaturalistId
      );
      if (exists) {
        console.log(
          "Plant with this iNaturalist ID already exists in favorites, not adding again."
        );
        return;
      }
      // generate unique id and add
      const favToAdd: Favorite = {
        id: uuid.v4() as string,
        ...plantData,
      };
      favorites.push(favToAdd);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      loadFavorites();
    } catch (error) {
      console.error("Error adding plant to favorites:", error);
      console.error(JSON.stringify(plantData));
    }
  };

  const updateFavorite = async (
    id: string,
    updatedData: Partial<Omit<Favorite, "id">>
  ) => {
    if (!favorites) return;
    try {
      const plantIndex = favorites.findIndex((plant) => plant.id === id);
      if (plantIndex === -1) {
        console.error("Plant not found in favorites");
        return;
      }
      // Update only the provided fields
      favorites[plantIndex] = { ...favorites[plantIndex], ...updatedData };
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      loadFavorites();
    } catch (error) {
      console.error("Error updating plant in favorites:", error);
    }
  };

  const removeFavorite = async (id: string) => {
    if (!favorites) return;
    try {
      const updatedFavorites = favorites.filter((plant) => plant.id !== id);
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
      loadFavorites();
    } catch (error) {
      console.error("Error removing plant from favorites:", error);
    }
  };

  const clearAllFavorites = async () => {
    if (!favorites) return;
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      loadFavorites();
      console.log("Cleared all favorites");
    } catch (error) {
      console.error("Error clearing favorite plants:", error);
    }
  };

  return {
    favorites,
    addFavorite,
    updateFavorite,
    removeFavorite,
    clearAllFavorites,
  };
}
