// app/(tabs)/profile/Favorites.tsx
import { ThemedText, ThemedView } from "@/components/Themed";
import { StyleSheet } from "react-native";

export default function Favorites() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>This is the Favorites Screen</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
