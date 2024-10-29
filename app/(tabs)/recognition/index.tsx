// app/(tabs)/recognition/ImageRecognitionScreen.tsx
import { ThemedText, ThemedView } from "@/components/Themed";
import { StyleSheet } from "react-native";

export default function ImageRecognitionScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Image Recognition Screen</ThemedText>
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
