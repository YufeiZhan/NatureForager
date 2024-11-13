import { FavoritesContext } from "@/hooks/FavoritesContext";
import Map, { MapProps, Markers } from "./Map";
import { useContext, useEffect, useState } from "react";
import { Favorite } from "@/hooks/useFavorites";

interface FavoritesMapProps extends MapProps {
  selectedFavoriteId?: string;
  onSelectFavorite?: (favorite: Favorite) => void;
  onDeselectFavorites?: () => void;
}

export default function FavoritesMap({
  selectedFavoriteId,
  onSelectFavorite,
  onDeselectFavorites,
  ...mapProps
}: FavoritesMapProps) {
  const [markers, setMarkers] = useState<Markers>({});

  // construct markers for favorites
  const { favorites } = useContext(FavoritesContext);
  useEffect(() => {
    const newMarkers: Markers = {};
    favorites?.forEach((fav) => {
      newMarkers[fav.id] = {
        coordinate: {
          latitude: fav.location.latitude,
          longitude: fav.location.longitude,
        },
        // title: fav.name,
        // description: fav.note,
        onPress: (e) => {
          onSelectFavorite?.(fav);
        },
      };
    });
    setMarkers(newMarkers);
  }, [favorites]);

  return (
    <Map
      markers={markers}
      animateToMarkerId={selectedFavoriteId}
      onPress={onDeselectFavorites}
      {...mapProps}
    ></Map>
  );
}
