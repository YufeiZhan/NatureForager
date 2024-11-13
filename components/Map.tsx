import { RefObject, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import MapView, {
  UrlTile,
  BoundingBox,
  Marker,
  MapMarkerProps,
  MapMarker,
  MapPressEvent,
} from "react-native-maps";

export interface MapProps {
  initialLat: number;
  initialLng: number;
  initialLatExtent?: number;
  initialLngExtent?: number;
  selectedMarkerId?: string;
  markers?: Markers;
  onBoundsChange?: (bounds: BoundingBox) => void;
  onPress?: (e: MapPressEvent) => void;
}
interface MarkerProps extends MapMarkerProps {
  callout?: JSX.Element;
}
// string is the key/id of a marker
export type Markers = Record<string, MarkerProps>;

const PAN_ANIMATION_DURATION = 300; //ms

export default function Map({
  initialLat,
  initialLng,
  initialLatExtent = 0.05,
  initialLngExtent = 0.05,
  selectedMarkerId,
  markers = {},
  onBoundsChange,
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
    map.current?.getMapBoundaries().then(onBoundsChange);
  };

  const panToMarker = (markerId: string, duration: number) => {
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

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        ref={map}
        onMapReady={updateMapBounds}
        onRegionChangeComplete={updateMapBounds}
        showsUserLocation={true}
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
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
