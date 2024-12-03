import { LocationContext } from "@/hooks/LocationContext";
import { DEFAULT_LOCATION } from "@/hooks/useLocation";
import { useContext, useEffect, useRef, useState } from "react";
import Map, { Markers } from "@/components/Map";
import { Modal, Image } from "react-native";
import { ThemedButton, ThemedView } from "./Themed";
import { StyleSheet } from "react-native";
import { yellowSand } from "@/constants/Colors";
import MapView, { Region } from "react-native-maps";

interface EditLocationModalProps {
  visible: boolean;
  latitude: number;
  longitude: number;
  onClose: () => void;
  onConfirmLocation: (latitude: number, longitude: number) => void;
}

export default function EditLocationModal({
  visible,
  latitude,
  longitude,
  onClose,
  onConfirmLocation,
}: EditLocationModalProps) {
  // load user location as a fallback
  const { location: userLocation } = useContext(LocationContext);

  const [centerLat, setCenterLat] = useState(DEFAULT_LOCATION.latitude);
  const [centerLng, setCenterLng] = useState(DEFAULT_LOCATION.longitude);
  // when modal is opened/reopened, reset to default location
  // also reset location if location changed
  useEffect(() => {
    setCenterLat(
      latitude || userLocation?.latitude || DEFAULT_LOCATION.latitude
    );
    setCenterLng(
      longitude || userLocation?.longitude || DEFAULT_LOCATION.longitude
    );
  }, [visible, latitude, longitude]);

  const handleRegionChange = (region: Region) => {
    setCenterLat(region.latitude);
    setCenterLng(region.longitude);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <Map
        initialLat={centerLat}
        initialLng={centerLng}
        initialLatExtent={0.005}
        initialLngExtent={0.005}
        onRegionChange={handleRegionChange}
      />
      <Image
        source={require("@/assets/pin/choose-location.png")}
        style={styles.pin}
      />
      <ThemedView style={styles.bottomButtons}>
        <ThemedButton
          title="Cancel"
          action="secondary"
          onPress={onClose}
        ></ThemedButton>
        <ThemedButton
          action="primary"
          title="Confirm Location"
          onPress={() => onConfirmLocation(centerLat, centerLng)}
        ></ThemedButton>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bottomButtons: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 80,
    padding: 10,
    paddingBottom: 20,
    position: "absolute",
    backgroundColor: yellowSand,
    bottom: 0,
  },
  pin: {
    position: "absolute",
    // aspect ratio 0.5 ish
    width: 30,
    height: 60,
    // position bottom at map center
    alignSelf: "center",
    bottom: "50%",
    // make sure the pin anchor location is at map center
    transform: "translateY(10dp)",
    // don't interfere with map dragging
    pointerEvents: "none",
  },
});
