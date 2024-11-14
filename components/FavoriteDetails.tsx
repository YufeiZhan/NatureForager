import { Favorite } from "@/hooks/useFavorites";
import { ThemedButton, ThemedText, ThemedView } from "./Themed";

interface FavoriteDetailsProps {
  favorite: Favorite;
  onClose: () => void;
}

export default function FavoriteDetails({
  favorite,
  onClose,
}: FavoriteDetailsProps) {
  return (
    <ThemedView>
      <ThemedText>{favorite.name}</ThemedText>
      <ThemedButton title="Close" onPress={onClose}></ThemedButton>
    </ThemedView>
  );
}
