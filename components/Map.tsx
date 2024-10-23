import { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { UrlTile } from "react-native-maps";

interface MapProps {
  iNaturalistTaxonId?: number;
  lat?: number;
  lon?: number;
}

export default function Map({ iNaturalistTaxonId, lat, lon }: MapProps) {
  const [region, setRegion] = useState({
    // default map center is Duke Chapel
    latitude: lat || 36.001687,
    longitude: lon || -78.939824,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const map = useRef<MapView>(null);

  const onMapReady = () => {
    map.current?.getMapBoundaries().then((bounds) => {
      console.log("hi");
      console.log(bounds);
    });
  };

  useEffect(() => {
    if (iNaturalistTaxonId === undefined) return;
    const fetchINaturalistData = async () => {
      const url = `https://api.inaturalist.org/v1/observations?taxon_id=83435&`;
    };
    fetchINaturalistData();
  }, [iNaturalistTaxonId]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={region}
        ref={map}
        onMapReady={onMapReady}
      >
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
