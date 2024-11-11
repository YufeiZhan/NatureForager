import { LocationContext } from "@/hooks/LocationContext";
import { DEFAULT_LOCATION } from "@/hooks/useLocation";
import { useContext } from "react";
import Map from "@/components/Map";
import { useNonArraySearchParams } from "@/hooks/useNonArraySearchParams";

export default function EditLocation() {
  const { latitude, longitude } = useNonArraySearchParams();
  const { location } = useContext(LocationContext);

  console.log(latitude, longitude);

  return (
    <Map
      initialLat={
        Number(latitude) || location?.latitude || DEFAULT_LOCATION.latitude
      }
      initialLng={
        Number(longitude) || location?.longitude || DEFAULT_LOCATION.longitude
      }
      initialLatExtent={0.005}
      initialLngExtent={0.005}
    />
  );
}
