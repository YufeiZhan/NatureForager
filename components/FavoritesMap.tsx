import { FavoritesContext } from "@/hooks/FavoritesContext";
import Map, { MapProps, Markers } from "./Map";
import { useContext, useEffect, useState } from "react";

interface FavoritesMapProps extends MapProps {
  selectedFavoriteId?: string;
}

export default function FavoritesMap({
  selectedFavoriteId,
  ...mapProps
}: FavoritesMapProps) {
  const [markers, setMarkers] = useState<Markers>({});

  // when marker is selected, pan to it
  useEffect(() => {
    if (!selectedFavoriteId) return;
  }, [selectedFavoriteId]);

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
        title: fav.name,
        description: fav.note,
        onPress: () => {
          console.log(fav.name);
        },
      };
    });
    setMarkers(newMarkers);
  }, [favorites]);

  return (
    <Map
      markers={markers}
      animateToMarkerId={selectedFavoriteId}
      {...mapProps}
    ></Map>
  );
}
