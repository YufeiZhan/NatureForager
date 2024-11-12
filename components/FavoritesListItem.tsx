import { Favorite } from "@/hooks/useFavorites";
import { ThemedText, ThemedView } from "./Themed";
import { StyleSheet, Image, Pressable } from "react-native";
import { ivoryWhite } from "@/constants/Colors";

export default function FavoritesListItem({
  favorite,
  onPress,
}: {
  favorite: Favorite;
  onPress?: () => void;
}) {
  const imgSource = favorite.photos?.[0]
    ? { uri: favorite.photos[0] }
    : require("@/assets/plant/leaf.png");

  return (
    <Pressable onPress={onPress}>
      <ThemedView style={styles.listItem}>
        <Image style={styles.image} source={imgSource}></Image>
        <ThemedView style={{ flex: 1 }}>
          <ThemedText style={styles.name}>{favorite.name}</ThemedText>
          {favorite.note && <ThemedText>{favorite.note}</ThemedText>}
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: ivoryWhite,
  },
  image: {
    width: 50,
    height: 50,
  },
  name: {
    fontWeight: "bold",
  },
});
