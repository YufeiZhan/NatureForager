import { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, {
  UrlTile,
  BoundingBox,
  LatLng,
  Marker,
} from "react-native-maps";
import { ObservationsResponse } from "@/iNaturalistTypes";

interface MapProps {
  initialLat: number;
  initialLng: number;
  initialExtent?: number;
  iNaturalistTaxonId?: string;
  initialMarkers?: Markers;
}
interface MarkerInfo {
  coordinate: LatLng;
}
type Markers = Record<string, MarkerInfo>;

export default function Map({
  initialLat,
  initialLng,
  initialExtent = 0.05,
  iNaturalistTaxonId,
  initialMarkers = {},
}: MapProps) {
  const map = useRef<MapView>(null);

  // region is the area to include within the map, but the map will probably
  // show more, depending on the aspect ratio
  const initialRegion = {
    latitude: initialLat,
    longitude: initialLng,
    latitudeDelta: initialExtent,
    longitudeDelta: initialExtent,
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

  // object containing map marker info
  const [markers, setMarkers] = useState<Markers>(initialMarkers);
  // when taxon id changes, reset markers
  useEffect(() => {
    setMarkers(initialMarkers);
  }, [iNaturalistTaxonId]);

  // fetch iNaturalist observations whenever the taxon id changes or map bounds change
  // don't fetch observations we've fetched previously
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
        "not_id=" + Object.keys(markers).join(","),
      ];
      const url =
        "https://api.inaturalist.org/v1/observations?" + params.join("&");
      const data: ObservationsResponse = await (await fetch(url)).json();

      // update marker list
      const newMarkers: Markers = { ...markers };
      data.results.forEach((observation) => {
        // location is stored in observation.location as the string "lat,lng"
        const latlng = observation.location?.split(",").map(Number);
        if (latlng === undefined) return;
        if (observation.id !== undefined) {
          newMarkers[observation.id] = {
            coordinate: { latitude: latlng[0], longitude: latlng[1] },
          };
        }
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
        showsUserLocation={true}
      >
        {Object.entries(markers).map(([id, info]) => (
          <Marker key={id} coordinate={info.coordinate}></Marker>
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
