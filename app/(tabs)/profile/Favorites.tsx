// app/(tabs)/profile/Favorites.tsx
import FavoritesListItem from "@/components/FavoritesListItem";
import FavoritesMap from "@/components/FavoritesMap";
import { ThemedFlatList, ThemedText, ThemedView } from "@/components/Themed";
import { yellowSand } from "@/constants/Colors";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { LocationContext } from "@/hooks/LocationContext";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useContext } from "react";
import { StyleSheet } from "react-native";

export default function Favorites() {
  const { location } = useContext(LocationContext);
  const { favorites } = useContext(FavoritesContext);

  return (
    <>
      {!location && <ThemedText>Loading location...</ThemedText>}
      {location && (
        <>
          <FavoritesMap
            initialLat={Number(location.latitude)}
            initialLng={Number(location.longitude)}
          />
          <BottomSheet
            backgroundStyle={styles.bottomSheet}
            snapPoints={["5%", "40%"]}
            index={1}
          >
            {favorites && (
              <BottomSheetFlatList
                style={styles.favList}
                data={favorites}
                renderItem={({ item }) => <FavoritesListItem favorite={item} />}
              />
            )}
          </BottomSheet>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: yellowSand,
  },
  favList: {
    padding: 15,
  },
});
