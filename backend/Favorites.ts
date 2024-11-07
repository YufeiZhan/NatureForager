import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

interface Plant {
  iNatualistId: string;
  RandomlyGeneratedId: string;
  name: string;
  location: { latitude: number; longitude: number };
  photos?: string[];
  note?: string;
}

const FAVORITES_KEY = "@favorite_plants";

// Helper function to get all favorites
export async function getFavorites(): Promise<Plant[]> {
  try {
    const storedPlants = await AsyncStorage.getItem(FAVORITES_KEY);
    return storedPlants ? JSON.parse(storedPlants) : [];
  } catch (error) {
    console.error("Error fetching favorite plants:", error);
    return [];
  }
}

// Add a new plant to favorites
export async function addPlantToFavorites(plantData: Plant): Promise<void> {
  try {
    const favorites = await getFavorites();

    // Check for duplicates using the original `id`
    const exists = favorites.some((plant) => plant.iNatualistId === plantData.iNatualistId);
    if (exists) {
      console.log("Plant with this ID already exists in favorites, not adding again.");
      return;
    }

    favorites.push(plantData);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error adding plant to favorites:", error);
  }
}

// Update an existing plant in favorites
export async function updatePlantInFavorites(
  randomlyGeneratedId: string,
  updatedData: Partial<Omit<Plant, "RandomlyGeneratedId">>
): Promise<void> {
  try {
    const favorites = await getFavorites();
    const plantIndex = favorites.findIndex(
      (plant) => plant.RandomlyGeneratedId === randomlyGeneratedId
    );

    if (plantIndex === -1) {
      console.error("Plant not found in favorites");
      return;
    }

    // Update only the provided fields in the matched plant
    favorites[plantIndex] = { ...favorites[plantIndex], ...updatedData };
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error updating plant in favorites:", error);
  }
}

// Remove a plant from favorites
export async function removePlantFromFavorites(plantId: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter((plant) => plant.iNatualistId !== plantId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error("Error removing plant from favorites:", error);
  }
}

// Clear all favorite plants (optional utility function)
export async function clearAllFavorites(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error("Error clearing favorite plants:", error);
  }
}
