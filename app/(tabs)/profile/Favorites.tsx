// app/(tabs)/profile/Favorites.tsx
import FavoritesListItem from "@/components/FavoritesListItem";
import FavoritesMap from "@/components/FavoritesMap";
import { ThemedButton, ThemedText } from "@/components/Themed";
import { yellowSand } from "@/constants/Colors";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { LocationContext } from "@/hooks/LocationContext";
import { Favorite } from "@/hooks/useFavorites";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useContext, useRef, useState } from "react";
import { StyleSheet } from "react-native";

export default function Favorites() {
  const { location } = useContext(LocationContext);
  const { favorites } = useContext(FavoritesContext);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleListItemPressed = (fav: Favorite) => {
    setSelectedFavoriteId(fav.id);
    bottomSheetRef.current?.snapToIndex(1);
  };

  return (
    <>
      {!location && <ThemedText>Loading location...</ThemedText>}
      {location && (
        <>
          <FavoritesMap
            initialLat={Number(location.latitude)}
            initialLng={Number(location.longitude)}
            selectedFavoriteId={selectedFavoriteId}
          />
          <BottomSheet
            backgroundStyle={styles.bottomSheet}
            snapPoints={["5%", "40%"]}
            index={1}
            ref={bottomSheetRef}
          >
            <ThemedButton title="Add Favorite" />
            {favorites && (
              <BottomSheetFlatList
                style={styles.favList}
                data={favorites}
                renderItem={({ item }) => (
                  <FavoritesListItem
                    favorite={item}
                    onPress={() => handleListItemPressed(item)}
                  />
                )}
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
