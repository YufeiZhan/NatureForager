import { createContext } from "react";
import { Favorite } from "./useFavorites";

interface FavoritesContextType {
  favorites: Favorite[] | undefined;
  addFavorite: (plantData: Omit<Favorite, "id">) => Promise<void>;
  updateFavorite: (
    id: string,
    updatedData: Partial<Omit<Favorite, "id">>
  ) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  clearAllFavorites: () => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: async () => {},
  updateFavorite: async () => {},
  removeFavorite: async () => {},
  clearAllFavorites: async () => {},
});
