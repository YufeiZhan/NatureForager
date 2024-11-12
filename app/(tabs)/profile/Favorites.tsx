// app/(tabs)/profile/Favorites.tsx
import FavoriteDetails from "@/components/FavoriteDetails";
import FavoritesListItem from "@/components/FavoritesListItem";
import FavoritesMap from "@/components/FavoritesMap";
import { ThemedButton, ThemedText } from "@/components/Themed";
import { yellowSand } from "@/constants/Colors";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { LocationContext } from "@/hooks/LocationContext";
import { Favorite } from "@/hooks/useFavorites";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import { useContext, useRef, useState } from "react";
import { StyleSheet } from "react-native";

export default function Favorites() {
  const { location } = useContext(LocationContext);
  const { favorites } = useContext(FavoritesContext);
  const [selectedFavorite, setSelectedFavorite] = useState<Favorite>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const favListRef = useRef<BottomSheetFlatListMethods>(null);

  const handleListItemPressed = (fav: Favorite) => {
    setSelectedFavorite(fav);
    bottomSheetRef.current?.snapToIndex(1);
    // favListRef.current?.scrollToItem({ item: fav, viewPosition: 0 });
  };

  return (
    <>
      {!location && <ThemedText>Loading location...</ThemedText>}
      {location && (
        <>
          <FavoritesMap
            initialLat={Number(location.latitude)}
            initialLng={Number(location.longitude)}
            selectedFavoriteId={selectedFavorite?.id}
          />
          <BottomSheet
            backgroundStyle={styles.bottomSheet}
            enableDynamicSizing={false}
            snapPoints={["5%", "35%", "100%"]}
            index={1}
            ref={bottomSheetRef}
          >
            {/* if no favorite selected, show full list */}
            {favorites && !selectedFavorite && (
              <>
                <ThemedButton title="Add Favorite" />
                <BottomSheetFlatList
                  style={styles.favList}
                  data={favorites}
                  ref={favListRef}
                  renderItem={({ item }) => (
                    <FavoritesListItem
                      favorite={item}
                      onPress={() => handleListItemPressed(item)}
                    />
                  )}
                />
              </>
            )}
            {/* if there is a favorite selected, show its details */}
            {selectedFavorite && (
              <FavoriteDetails
                favorite={selectedFavorite}
                onClose={() => setSelectedFavorite(undefined)}
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
