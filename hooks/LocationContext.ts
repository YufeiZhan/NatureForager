import { createContext } from "react";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: UserLocation | undefined;
  setLocation: (location: UserLocation | undefined) => void;
}

export const LocationContext = createContext<LocationContextType>({
  location: undefined,
  setLocation: () => {},
});