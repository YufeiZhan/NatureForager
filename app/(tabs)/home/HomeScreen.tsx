// app/home/HomeScreen.tsx
import { ThemedButton, ThemedText, ThemedView } from "@/components/Themed";
import { Link, useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText>Welcome to the Home Screen</ThemedText>
      <ThemedButton
        title="Go to Details"
        onPress={() => router.push("/PlantInfoModal")}
      />

      <Link href="./PlantLocation?iNaturalistTaxonId=54504&commonName=Black%20Walnut">
        Black Walnut
      </Link>
      <Link href="./PlantLocation?iNaturalistTaxonId=83435&commonName=American Persimmon">
        Persimmon
      </Link>
    </ThemedView>
  );
}
