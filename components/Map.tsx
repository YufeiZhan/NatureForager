import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import MapView, {
  UrlTile,
  BoundingBox,
  LatLng,
  Marker,
  MapMarkerProps,
} from "react-native-maps";

export interface MapProps {
  initialLat: number;
  initialLng: number;
  initialLatExtent?: number;
  initialLngExtent?: number;
  markers?: Markers;
  onBoundsChange?: (bounds: BoundingBox) => void;
}
// string is the key/id of a marker
export type Markers = Record<string, MapMarkerProps>;

export default function Map({
  initialLat,
  initialLng,
  initialLatExtent = 0.05,
  initialLngExtent = 0.05,
  markers = {},
  onBoundsChange,
}: MapProps) {
  const map = useRef<MapView>(null);

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

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        ref={map}
        onMapReady={updateMapBounds}
        onRegionChangeComplete={updateMapBounds}
        showsUserLocation={true}
      >
        {Object.entries(markers).map(([key, props]) => (
          <Marker key={key} {...props}></Marker>
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
