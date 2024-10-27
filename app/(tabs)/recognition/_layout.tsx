import { Stack } from "expo-router";

export default function RecognitionLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Image Recognition" }}
      ></Stack.Screen>
    </Stack>
  );
}
