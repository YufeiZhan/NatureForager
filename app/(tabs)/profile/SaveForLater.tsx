// app/(tabs)/profile/SaveForLater.tsx
import { ThemedText, ThemedView } from "@/components/Themed";
import { StyleSheet } from "react-native";

export default function SaveForLater() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>This is the Save for Later Screen</ThemedText>
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
