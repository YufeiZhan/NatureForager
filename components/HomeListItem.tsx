import { Pressable } from "react-native";
import { ThemedView, ThemedText } from "./Themed";
import { useContext } from "react";
import { LocationContext } from "@/hooks/LocationContext";
import { useRouter } from "expo-router";

interface ItemData {
  taxonId: number;
  name: string;
  distance: number | null;
}

export default function HomeListItem(item: ItemData) {
  const { location, setLocation } = useContext(LocationContext);
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/home/PlantLocation",
          params: {
            iNaturalistTaxonId: item.taxonId,
            commonName: item.name,
            lat: location?.latitude,
            lng: location?.longitude,
          },
        });
      }}
    >
      <ThemedView>
        <ThemedText>
          {item.name} -{" "}
          {item.distance !== null
            ? `Closest Distance: ${Number(item.distance).toFixed(2)} km`
            : "No observations found near you"}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}
