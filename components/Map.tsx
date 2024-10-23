import { View, StyleSheet } from "react-native";
import MapView, { UrlTile } from "react-native-maps";

interface MapProps {
  iNaturalistTaxonId?: number;
  lat?: number;
  lon?: number;
}

export default function Map({ iNaturalistTaxonId, lat, lon }: MapProps) {
  let initialRegion = {
    // default map center is Duke Chapel
    latitude: 36.001687,
    longitude: -78.939824,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  if (lat && lon) {
    initialRegion.latitude = lat;
    initialRegion.longitude = lon;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={styles.map} initialRegion={initialRegion}>
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
