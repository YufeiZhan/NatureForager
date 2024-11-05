import { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, {
  UrlTile,
  BoundingBox,
  LatLng,
  Marker,
  MapMarkerProps,
} from "react-native-maps";
import { Observation, ObservationsResponse } from "@/iNaturalistTypes";

interface MapProps {
  iNaturalistTaxonId?: string;
  initialLat?: number;
  initialLng?: number;
  onINaturalistMarkerPress?: (observation: Observation) => void;
}

interface MarkerInfo extends MapMarkerProps {
  key: number;
}

export default function Map({
  iNaturalistTaxonId,
  initialLat,
  initialLng,
  onINaturalistMarkerPress,
}: MapProps) {
  const map = useRef<MapView>(null);

  // region is the area to include within the map, but the map will probably
  // show more, depending on the aspect ratio
  const initialRegion = {
    // default map center is Duke Chapel
    latitude: initialLat || 36.001687,
    longitude: initialLng || -78.939824,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  // map bounds are the actual rendered bounds, we will update these as the user moves the map
  const [mapBounds, setMapBounds] = useState<BoundingBox | undefined>(
    undefined
  );
  const updateMapBounds = () => {
    map.current?.getMapBoundaries().then((bounds) => {
      setMapBounds(bounds);
    });
  };

  // list of map markers
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);

  // fetch iNaturalist observations whenever the taxon id changes or map bounds change
  useEffect(() => {
    if (iNaturalistTaxonId === undefined || mapBounds === undefined) return;
    const fetchINaturalistData = async () => {
      const params = [
        "taxon_id=" + iNaturalistTaxonId,
        "quality_grade=needs_id,research",
        "geoprivacy=open",
        "licensed=true",
        "per_page=200",
        "nelat=" + mapBounds.northEast.latitude,
        "nelng=" + mapBounds.northEast.longitude,
        "swlat=" + mapBounds.southWest.latitude,
        "swlng=" + mapBounds.southWest.longitude,
      ];
      const url =
        "https://api.inaturalist.org/v1/observations?" + params.join("&");
      const data: ObservationsResponse = await (await fetch(url)).json();

      // update marker list
      const newMarkers: MarkerInfo[] = [];
      data.results.forEach((observation) => {
        // location is stored in observation.location as the string "lat,lng"
        const latlng = observation.location?.split(",").map((x) => Number(x));
        if (latlng === undefined) return;
        newMarkers.push({
          key: observation.id || 0,
          coordinate: { latitude: latlng[0], longitude: latlng[1] },
          onPress: () => onINaturalistMarkerPress?.(observation),
        });
      });
      setMarkers(newMarkers);
    };
    fetchINaturalistData();
  }, [iNaturalistTaxonId, mapBounds]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        ref={map}
        onMapReady={updateMapBounds}
        onRegionChangeComplete={updateMapBounds}
      >
        {markers.map((m) => (
          <Marker {...m}></Marker>
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
