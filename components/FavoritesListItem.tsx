import { Favorite } from "@/hooks/useFavorites";
import { ThemedText, ThemedView } from "./Themed";
import { StyleSheet, Image, Pressable } from "react-native";
import { pureWhite } from "@/constants/Colors";
import { calculateDistance } from "@/scripts/minSpeciesDistances";
import { useLocation } from "@/hooks/useLocation";
import { useMemo } from "react";

interface FavoritesListItemProps {
  favorite: Favorite;
  selected?: boolean;
  onPress?: () => void;
}

export default function FavoritesListItem({
  favorite,
  onPress,
}: FavoritesListItemProps) {
  const [userLocation, setLocation] = useLocation();

  const imgSource = favorite.photos?.[0]
    ? { uri: favorite.photos[0] }
    : require("@/assets/plant/leaf.png");

  const distanceString: string = useMemo(() => {
    if (!userLocation) return "";
    const distance = calculateDistance(
      favorite.location.latitude,
      favorite.location.longitude,
      userLocation.latitude,
      userLocation.longitude
    );
    return distance.toFixed(2) + " km";
  }, [favorite, userLocation]);

  return (
    <Pressable onPress={onPress} style={styles.listItem}>
      <Image style={styles.image} source={imgSource}></Image>
      <ThemedView style={{ flex: 1 }}>
        <ThemedText style={styles.name}>{favorite.name}</ThemedText>
      </ThemedView>

      {/* distance from me to favorite */}
      {userLocation && (
        <ThemedView style={styles.subContainerRight}>
          <Image source={require("@/assets/pin/home.png")}></Image>
          <ThemedText style={styles.distance}>{distanceString}</ThemedText>
        </ThemedView>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: pureWhite,
    opacity: 0.8,
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  name: {
    fontWeight: "bold",
  },
  subContainerRight: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  distance: {
    textAlign: "right",
    minWidth: 2,
  },
});
