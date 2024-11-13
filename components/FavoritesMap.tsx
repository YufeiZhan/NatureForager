import { FavoritesContext } from "@/hooks/FavoritesContext";
import Map, { MapProps, Markers } from "./Map";
import { useContext, useEffect, useState } from "react";

interface FavoritesMapProps extends MapProps {}

export default function FavoritesMap({ ...mapProps }: FavoritesMapProps) {
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
        onPress: () => {
          console.log(fav.name);
        },
      };
    });
    setMarkers(newMarkers);
  }, [favorites]);

  return <Map markers={markers} {...mapProps}></Map>;
}
