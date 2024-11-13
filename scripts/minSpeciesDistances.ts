import { ObservationsResponse, Observation } from "@/iNaturalistTypes";

export async function fetchMinimumDistancesForSpecies(
  species: { [key: number]: string },
  lat: number,
  lng: number,
  onUpdate: (taxonId: number, distance: number | null) => void,
  onResultsReturned: () => void
) {
  let radius = 2;
  const speciesMinDistances: { [key: number]: number | null } = {};
  let remainingIds = Object.keys(species).map(Number);
  let resultsStarted = false;

  try {
    while (remainingIds.length > 0 && radius <= 32) {
      const taxonIdsString = remainingIds.join("%2C");

      console.log(
        `Fetching ${remainingIds.length} taxa, using radius ${radius} km`
      );
      const url = `https://api.inaturalist.org/v1/observations?taxon_id=${taxonIdsString}&geoprivacy=open&verifiable=true&licensed=true&per_page=200&lat=${lat}&lng=${lng}&radius=${radius}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          `Error fetching observations: ${response.status} ${response.statusText}`
        );
        break;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = (await response.json()) as ObservationsResponse;

        if (!resultsStarted && data.results.length > 0) {
          resultsStarted = true;
          onResultsReturned();
        }

        const { foundIds, nextRemainingIds } = processObservationsWithRadius(
          data.results,
          remainingIds,
          lat,
          lng
        );
        for (const [taxonId, distance] of Object.entries(foundIds)) {
          speciesMinDistances[Number(taxonId)] = distance;
          onUpdate(Number(taxonId), distance); // Progressive update
        }
        remainingIds = nextRemainingIds;

        // if nothing found, expand the search radius
        if (data.total_results === 0) {
          radius *= 2;
        }
      } else {
        console.error(
          `Error fetching observations: Received non-JSON response`
        );
        break;
      }
    }

    for (const id of Object.keys(species).map(Number)) {
      if (!speciesMinDistances[id]) {
        speciesMinDistances[id] = null;
      }
    }
  } catch (error) {
    console.error("Error fetching minimum distances:", error);
  }

  return speciesMinDistances;
}

const processObservationsWithRadius = (
  observations: Observation[],
  taxonIds: (string | number)[],
  userLat: number,
  userLng: number
) => {
  const taxonIdsAsNumbers = taxonIds.map(Number);
  const foundIds: { [taxonId: number]: number } = {};
  const nextRemainingIds: number[] = [];

  for (const observation of observations) {
    const taxonId = observation.taxon?.id;
    const ancestorIds: number[] = observation.taxon?.ancestor_ids || [];
    const locationString = observation.location;

    // Check if either the observation's taxonId or one of its ancestors matches with the provided taxonIds
    const matchesTaxonId = taxonId && taxonIdsAsNumbers.includes(taxonId);
    const matchesAncestorId = ancestorIds.some((ancestorId) =>
      taxonIdsAsNumbers.includes(ancestorId)
    );

    if (!locationString || !(matchesTaxonId || matchesAncestorId)) continue;

    const matchedTaxonId = matchesTaxonId
      ? taxonId
      : ancestorIds.find((id) => taxonIdsAsNumbers.includes(id));

    if (!matchedTaxonId) continue;

    const [obsLat, obsLng] = locationString.split(",").map(Number);
    const distance = calculateDistance(userLat, userLng, obsLat, obsLng);

    if (!foundIds[matchedTaxonId] || distance < foundIds[matchedTaxonId]) {
      foundIds[matchedTaxonId] = distance;
    }
  }

  for (const id of taxonIdsAsNumbers) {
    if (!foundIds[id]) {
      nextRemainingIds.push(id);
    }
  }

  return { foundIds, nextRemainingIds };
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
