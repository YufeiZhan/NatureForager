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
      <Link href="./PlantLocation"> Go to Plant Location </Link>
      <Link href="/PlantInfoModal?iNaturalistID=47602">
        <ThemedText>Go to Plant Info Modal</ThemedText>
      </Link>
    </ThemedView>
  );
}
