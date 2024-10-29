export async function fetchMinimumDistancesForSpecies(
  species: { [key: number]: string },
  lat: number,
  lng: number,
  updateDistanceCallback: (taxonId: number, distance: number | null) => void
) {
  let radius = 2;
  const speciesMinDistances: { [key: number]: number | null } = {};
  let remainingIds = Object.keys(species).map(Number);

  try {
    while (remainingIds.length > 0 && radius <= 32) {
      const taxonIdsString = remainingIds.join("%2C");

      const url = `https://api.inaturalist.org/v1/observations?taxon_id=${taxonIdsString}&geoprivacy=open&quality_grade=research&per_page=200&order=desc&order_by=observed_on&lat=${lat}&lng=${lng}&radius=${radius}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          `Error fetching observations: ${response.status} ${response.statusText}`
        );
        break;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        const { foundIds, nextRemainingIds } = processObservationsWithRadius(
          data.results,
          remainingIds,
          lat,
          lng
        );
        
        // Update each taxon ID's distance progressively
        for (const [taxonId, distance] of Object.entries(foundIds)) {
          const id = Number(taxonId);
          speciesMinDistances[id] = distance;
          // Call the update callback as each distance is found
          updateDistanceCallback(id, distance);
        }

        remainingIds = nextRemainingIds;
      } else {
        console.error(
          `Error fetching observations: Received non-JSON response`
        );
        break;
      }
      radius *= 2;
    }

    // For any species not found, set its distance to null
    for (const id of Object.keys(species).map(Number)) {
      if (!speciesMinDistances[id]) {
        speciesMinDistances[id] = null;
        updateDistanceCallback(id, null);
      }
    }
  } catch (error) {
    console.error("Error fetching minimum distances:", error);
  }
}

const processObservationsWithRadius = (
  observations: any,
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

    const matchedTaxonId = matchesTaxonId ? taxonId : ancestorIds.find((id) => taxonIdsAsNumbers.includes(id));

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

const calculateDistance = (
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
