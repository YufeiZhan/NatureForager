import { useLocalSearchParams } from "expo-router";

// hook to filter out array params when we know we aren't using them
// useful so we don't have to check for string vs string[] type every time
export function useNonArraySearchParams() {
  const params = useLocalSearchParams();
  const nonArrayParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (!Array.isArray(value)) {
      nonArrayParams[key] = value;
    }
  }
  return nonArrayParams;
}
