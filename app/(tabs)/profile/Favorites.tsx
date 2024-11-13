// app/(tabs)/profile/Favorites.tsx
import FavoritesMap from "@/components/FavoritesMap";
import { ThemedText } from "@/components/Themed";
import { LocationContext } from "@/hooks/LocationContext";
import { useContext } from "react";
import { StyleSheet } from "react-native";

export default function Favorites() {
  const { location } = useContext(LocationContext);

  return (
    <>
      {!location && <ThemedText>Loading location...</ThemedText>}
      {location && (
        <FavoritesMap
          initialLat={Number(location.latitude)}
          initialLng={Number(location.longitude)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({});
