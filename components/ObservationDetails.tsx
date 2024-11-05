import {
  Image,
  StyleSheet,
  Pressable,
  TextProps,
  useWindowDimensions,
} from "react-native";
import {
  ThemedScrollView,
  ThemedView,
  ThemedText,
  ThemedButton,
} from "../components/Themed";
import { pureWhite, oliveGreen } from "@/constants/Colors";
import { Observation } from "../iNaturalistTypes";
import { useRouter } from "expo-router";

function ModalText(props: TextProps) {
  return (
    <ThemedText
      style={[{ color: pureWhite, marginLeft: 16 }, props.style]}
      {...props}
    />
  );
}

interface ObservationDetailsProps {
  observation: Observation;
  onClose: () => void;
}

export default function ObservationDetails({
  observation,
  onClose,
}: ObservationDetailsProps) {
  const { width } = useWindowDimensions();

  const router = useRouter();
  const handleAddToFavorites = () => {
    console.log("Add to Favorites pressed");
  };

  //   const handleClose = () => {
  //     console.log('Close modal');
  //     router.back();
  //   };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedScrollView>
        {/* Header with common name */}
        <ThemedView style={styles.headerContainer}>
          <ModalText style={styles.header}>
            {observation.common_name || "Observation Details"}
          </ModalText>
        </ThemedView>

        {/* Observation Date and Note */}
        <ThemedView style={styles.detailsContainer}>
          <ModalText>
            Observed on: {observation.observed_on || "Date not available"}
          </ModalText>
          <ModalText></ModalText>
          <ModalText>
            {observation.description || "No notes available"}
          </ModalText>
        </ThemedView>

        {/* Add to Favorite Button */}
        <ThemedButton title="Add to Favorites" onPress={handleAddToFavorites} />

        {/* Photos */}
        <ThemedView style={styles.photoContainer}>
          {observation.photos && observation.photos.length > 0 ? (
            observation.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo.url }}
                style={[
                  styles.photo,
                  { width: width - 32, height: width - 32 },
                ]}
                resizeMode="cover"
              />
            ))
          ) : (
            <ModalText>No photos available</ModalText>
          )}
        </ThemedView>
      </ThemedScrollView>
      <ThemedButton title="Back to Map" onPress={onClose} />
      <ModalText></ModalText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  header: {
    fontSize: 24,
    color: pureWhite,
    textAlign: "center",
    fontStyle: "italic",
  },
  detailsContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  photoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  photo: {
    marginVertical: 10,
    borderRadius: 10,
  },
});
