// app/(tabs)/favorites/Favorites.tsx
import FavoriteDetails from "@/components/FavoriteDetails";
import FavoritesListItem from "@/components/FavoritesListItem";
import FavoritesMap from "@/components/FavoritesMap";
import { ThemedButton, ThemedText } from "@/components/Themed";
import { yellowSand } from "@/constants/Colors";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { LocationContext } from "@/hooks/LocationContext";
import { Favorite } from "@/hooks/useFavorites";
import { useNonArraySearchParams } from "@/hooks/useNonArraySearchParams";
import { calculateDistance } from "@/scripts/minSpeciesDistances";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { globalStyles } from "@/styles/globalStyles";

export default function Favorites() {
  const { location } = useContext(LocationContext);
  const { favorites } = useContext(FavoritesContext);

  const sortedFavorites = useMemo(() => {
    // sort favorites by location
    if (!favorites) return [];
    if (!location) return favorites;
    // calculate distance of each favorite from user
    const distances: Record<string, number> = {};
    favorites.forEach((fav) => {
      distances[fav.id] = calculateDistance(
        fav.location.latitude,
        fav.location.longitude,
        location.latitude,
        location.longitude
      );
    });
    // slice so we don't affect original array, then sort
    return favorites.slice().sort((a, b) => {
      return distances[a.id] - distances[b.id];
    });
  }, [favorites]);

  // main "selected favorite" state
  // we select an ID instead of a favorite object, so that when the underlying favorite data updates,
  // we update the UI with the new favorite data (the id will remain the same)
  const [selectedId, setSelectedId] = useState("");
  const selectedFavorite = useMemo(() => {
    if (!selectedId || !favorites) return undefined;
    return favorites.find((fav) => fav.id === selectedId);
  }, [selectedId, favorites]);
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
      setSelectedId(fav.id);
    }
  }, [favoriteIdToShow]);

  const handleSelectFavorite = (fav: Favorite, mapTriggered = false) => {
    setSelectedId(fav.id);
    if (!mapTriggered) {
      setMarkerIdToSelect(fav.id);
    }
    // snap bottom sheet to mid position so we can see the map and where the marker is
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleDeselectFavorite = () => {
    setSelectedId("");
    setMarkerIdToSelect("");
  };

  const router = useRouter();
  const handleAddFavorite = () => {
    router.push("/(tabs)/favorites/CreateFavorite");
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
            onDeselectFavorites={() => handleDeselectFavorite()}
          />

          <BottomSheet
            backgroundStyle={globalStyles.bottomSheet}
            enableDynamicSizing={false}
            snapPoints={["5%", "35%", "100%"]}
            index={1}
            ref={bottomSheetRef}
          >
            {/* if no favorite selected, show full list */}
            {favorites && !selectedFavorite && (
              <>
                <ThemedButton
                  title="Add a Favorite"
                  onPress={handleAddFavorite}
                  action="primary"
                />
                <BottomSheetFlatList
                  style={styles.favList}
                  data={sortedFavorites}
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
                onClose={() => handleDeselectFavorite()}
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
