import { LocationContext } from "@/hooks/LocationContext";
import { DEFAULT_LOCATION } from "@/hooks/useLocation";
import { useContext } from "react";
import Map from "@/components/Map";
import { Modal } from "react-native";
import { ThemedButton, ThemedView } from "./Themed";
import { StyleSheet } from "react-native";
import { yellowSand } from "@/constants/Colors";

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

  return (
    <Modal visible={visible} animationType="slide">
      <Map
        initialLat={
          latitude || userLocation?.latitude || DEFAULT_LOCATION.latitude
        }
        initialLng={
          longitude || userLocation?.longitude || DEFAULT_LOCATION.longitude
        }
        initialLatExtent={0.005}
        initialLngExtent={0.005}
      />
      <ThemedView style={styles.bottomButtons}>
        <ThemedButton title="Cancel" onPress={onClose}></ThemedButton>
        <ThemedButton title="Confirm Location"></ThemedButton>
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
});
