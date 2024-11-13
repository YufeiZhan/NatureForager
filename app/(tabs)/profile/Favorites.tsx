// app/(tabs)/profile/Favorites.tsx
import FavoriteDetails from "@/components/FavoriteDetails";
import FavoritesListItem from "@/components/FavoritesListItem";
import FavoritesMap from "@/components/FavoritesMap";
import { ThemedButton, ThemedText } from "@/components/Themed";
import { yellowSand } from "@/constants/Colors";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { LocationContext } from "@/hooks/LocationContext";
import { Favorite } from "@/hooks/useFavorites";
import { useNonArraySearchParams } from "@/hooks/useNonArraySearchParams";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";

export default function Favorites() {
  const { location } = useContext(LocationContext);
  const { favorites } = useContext(FavoritesContext);

  // main "selected favorite" state
  const [selectedFavorite, setSelectedFavorite] = useState<Favorite>();
  // this second "selected favorite" state is for most recently selected favorite BY THE LIST
  // the map only responds to this one (NOT selectedFavorite), to avoid circular selection logic loops
  // this one is allowed to be out of date, since the map only responds to changes in this
  const [markerIdToSelect, setMarkerIdToSelect] = useState("");

  const bottomSheetRef = useRef<BottomSheet>(null);
  const favListRef = useRef<BottomSheetFlatListMethods>(null);

  // if search param passed to show a favorite, select it
  const { favoriteIdToShow } = useNonArraySearchParams();
  useEffect(() => {
    const fav = favorites?.find((fav) => fav.id === favoriteIdToShow);
    if (fav) {
      setSelectedFavorite(fav);
    }
  }, [favoriteIdToShow]);

  const handleSelectFavorite = (fav: Favorite, mapTriggered = false) => {
    setSelectedFavorite(fav);
    if (!mapTriggered) {
      setMarkerIdToSelect(fav.id);
    }
    // snap bottom sheet to mid position so we can see the map and where the marker is
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
            selectedFavoriteId={markerIdToSelect}
            onSelectFavorite={(fav) => handleSelectFavorite(fav, true)}
            onDeselectFavorites={() => setSelectedFavorite(undefined)}
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
                      onPress={() => handleSelectFavorite(item)}
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
