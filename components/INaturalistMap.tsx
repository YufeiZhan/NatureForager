import { Observation, ObservationsResponse } from "@/iNaturalistTypes";
import Map, { MapProps, Markers } from "./Map";
import { useEffect, useState } from "react";
import { BoundingBox } from "react-native-maps";

interface iNaturalistMapProps extends MapProps {
  iNaturalistTaxonId?: string;
  selectedMarkerId?: string;
  onPressObservation: (obs: Observation) => void;
  onPressMapBackground?: () => void;
}

export default function INaturalistMap({
  iNaturalistTaxonId,
  selectedMarkerId,
  onPressObservation,
  onPressMapBackground,
  ...mapProps
}: iNaturalistMapProps) {
  const [markers, setMarkers] = useState<Markers>({});
  const [mapBounds, setMapBounds] = useState<BoundingBox | undefined>(
    undefined
  );

  // when taxon id changes, reset markers
  useEffect(() => {
    setMarkers({});
  }, [iNaturalistTaxonId]);

  // fetch iNaturalist observations whenever the taxon id changes or map bounds change
  // don't fetch observations we've fetched previously
  useEffect(() => {
    if (iNaturalistTaxonId === undefined || mapBounds === undefined) return;
    const fetchINaturalistData = async () => {
      const params = [
        "taxon_id=" + iNaturalistTaxonId,
        "verifiable=true",
        "geoprivacy=open",
        "licensed=true",
        "per_page=200",
        "nelat=" + mapBounds.northEast.latitude,
        "nelng=" + mapBounds.northEast.longitude,
        "swlat=" + mapBounds.southWest.latitude,
        "swlng=" + mapBounds.southWest.longitude,
        "not_id=" + Object.keys(markers).join(","),
      ];
      const url =
        "https://api.inaturalist.org/v1/observations?" + params.join("&");
      const data: ObservationsResponse = await (await fetch(url)).json();

      // update marker list
      const newMarkers: Markers = { ...markers };
      data.results.forEach((observation) => {
        // location is stored in observation.location as the string "lat,lng"
        const latlng = observation.location?.split(",").map(Number);
        if (latlng === undefined) return;
        if (observation.id !== undefined) {
          newMarkers[observation.id] = {
            coordinate: { latitude: latlng[0], longitude: latlng[1] },
            onPress: () => onPressObservation(observation),
          };
        }
      });
      setMarkers(newMarkers);
    };
    fetchINaturalistData();
  }, [iNaturalistTaxonId, mapBounds]);

  return (
    <Map
      markers={markers}
      selectedMarkerId={selectedMarkerId}
      panToMarkerEnabled
      onBoundsChangeComplete={setMapBounds}
      onPress={onPressMapBackground}
      {...mapProps}
    ></Map>
  );
}
