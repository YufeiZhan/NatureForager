import { useContext, useEffect, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, {
  UrlTile,
  BoundingBox,
  Marker,
  MapMarkerProps,
  MapMarker,
  MapPressEvent,
  Region,
} from "react-native-maps";
import { FavoritesContext } from "@/hooks/FavoritesContext";

export interface MapProps {
  initialLat: number;
  initialLng: number;
  initialLatExtent?: number;
  initialLngExtent?: number;
  selectedMarkerId?: string;
  markers?: Markers;
  panToMarkerEnabled?: boolean;
  onBoundsChangeComplete?: (bounds: BoundingBox) => void;
  onRegionChange?: (region: Region) => void;
  onPress?: (e: MapPressEvent) => void;
}
interface MarkerProps extends MapMarkerProps {
  callout?: JSX.Element;
}
// string is the key/id of a marker
export type Markers = Record<string, MarkerProps>;

const PAN_ANIMATION_DURATION = 300; //ms

// forward MapView component ref so parents can use its methods
export default function Map({
  initialLat,
  initialLng,
  initialLatExtent = 0.05,
  initialLngExtent = 0.05,
  selectedMarkerId,
  markers = {},
  panToMarkerEnabled = false,
  onBoundsChangeComplete,
  onRegionChange,
  onPress,
}: MapProps) {
  const map = useRef<MapView>(null);
  // init refs to use for map markers
  const markerRefs = useRef<Record<string, MapMarker>>({});

  // region is the area to include within the map, but the map will probably
  // show more, depending on the aspect ratio
  const initialRegion = {
    latitude: initialLat,
    longitude: initialLng,
    latitudeDelta: initialLatExtent,
    longitudeDelta: initialLngExtent,
  };
  // map bounds are the actual rendered bounds, we will update these as the user moves the map
  const updateMapBounds = () => {
    map.current?.getMapBoundaries().then(onBoundsChangeComplete);
  };

  const panToMarker = (markerId: string, duration: number) => {
    if (!panToMarkerEnabled) return;
    const { latitude, longitude } = markers[markerId].coordinate;
    map.current?.animateCamera(
      {
        center: { latitude: latitude, longitude: longitude },
      },
      { duration: duration }
    );
  };

  // when new marker should be selected, pan the map and show a callout
  useEffect(() => {
    if (!map.current) return;
    if (!selectedMarkerId) {
      // no marker selected anymore, clear callouts (or at least try to)
      Object.values(markerRefs.current).forEach((m) => m.hideCallout());
      return;
    }
    panToMarker(selectedMarkerId, PAN_ANIMATION_DURATION);
    // also show its callout (only after the animation finishes, to prevent weirdness)
    setTimeout(() => {
      markerRefs.current?.[selectedMarkerId].showCallout();
    }, PAN_ANIMATION_DURATION + 50);
  }, [selectedMarkerId]);

  // map pin logic -----------------------

  // include favorites so we can show the favorited version of map pins
  const { favorites } = useContext(FavoritesContext);
  const favoriteIds = useMemo(() => {
    if (!favorites) return new Set<string>();
    const ids = new Set<string>();
    favorites.forEach((f) => {
      ids.add(f.id);
      if (f.iNaturalistId) ids.add(String(f.iNaturalistId));
    });
    return ids;
  }, [favorites]);

  const getMarkerImage = (key: string) => {
    const isFavorite = favoriteIds.has(key);
    const selected = key === selectedMarkerId;
    if (isFavorite && selected) return require("@/assets/pin/fav-selected.png");
    if (isFavorite && !selected) return require("@/assets/pin/fav-normal.png");
    if (!isFavorite && selected) return require("@/assets/pin/selected.png");
    return require("@/assets/pin/normal.png");
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={initialRegion}
      ref={map}
      onMapReady={updateMapBounds}
      onRegionChangeComplete={updateMapBounds}
      onRegionChange={onRegionChange}
      showsUserLocation={true}
      moveOnMarkerPress={false}
      onPress={onPress}
      onMarkerPress={(e) =>
        panToMarker(e.nativeEvent.id, PAN_ANIMATION_DURATION)
      }
    >
      {Object.entries(markers).map(([key, { callout, ...props }]) => (
        <Marker
          key={key} // for the .map()
          identifier={key} // for MapView event handling
          ref={(m) =>
            m ? (markerRefs.current[key] = m) : delete markerRefs.current[key]
          }
          stopPropagation // so we can detect if just pressing on the map background, not a marker
          image={getMarkerImage(key)}
          {...props}
        />
      ))}
      {/* uncomment to use open street map tiles */}
      {/* <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        /> */}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
