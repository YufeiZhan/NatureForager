import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export const DEFAULT_LOCATION: UserLocation = {
  latitude: 36.0014,
  longitude: -78.9382,
};

const getCurrentLocation = async (): Promise<UserLocation> => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission not granted");
      Alert.alert("Permission required", "Location default to Duke Chapel.");
      return DEFAULT_LOCATION;
    }

    const { coords } = await Location.getCurrentPositionAsync({});
    return { latitude: coords.latitude, longitude: coords.longitude };
  } catch (error) {
    console.error("Failed to fetch location:", error);
    return DEFAULT_LOCATION;
  }
};

export function useLocation(): [
  UserLocation | undefined,
  (location: UserLocation | undefined) => void
] {
  const [location, setLocation] = useState<UserLocation | undefined>(undefined);

  useEffect(() => {
    const fetchLocation = async () => {
      const userLocation = await getCurrentLocation();
      setLocation(userLocation);
    };
    fetchLocation();
  }, []);

  return [location, setLocation];
}
