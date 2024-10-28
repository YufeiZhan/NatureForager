// app/home/HomeScreen.tsx
import {
  ThemedButton,
  ThemedFlatList,
  ThemedText,
  ThemedView,
} from "@/components/Themed";
import { useRouter } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import { TextInput, ActivityIndicator } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  type Month = "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December";
  const allMonths: Month[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const jsonData = require("@/data/edible_plants.json");

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = allMonths[currentMonthIndex];

  const [selectedMonth, setSelectedMonth] = useState<Month>(currentMonth);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [speciesDistances, setSpeciesDistances] = useState<{ [key: number]: number | null }>({});
  const [speciesData, setSpeciesData] = useState<{ [key in Month]?: { [taxonId: number]: string } }>({});

  const filteredSpecies = useMemo(
    () => speciesData[selectedMonth] || {},
    [selectedMonth, speciesData]
  );
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const organizeSpeciesData = () => {
      const organizedData: { [key in Month]?: { [taxonId: number]: string } } = {};
      jsonData.forEach((record: { "iNaturalist ID": string; "Common Name": string; "Month Ripe": Month }) => {
        const month = record["Month Ripe"];
        const taxonId = parseInt(record["iNaturalist ID"], 10);
        const commonName = record["Common Name"];

        if (month && !isNaN(taxonId)) {
          if (!organizedData[month]) {
            organizedData[month] = {};
          }
          organizedData[month]![taxonId] = commonName;
        }
      });

      setSpeciesData(organizedData);
    };

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation({
          latitude: 36.0014,
          longitude: -78.9382,
        });
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    };

    const fetchDistances = async () => {
      if (location && Object.keys(filteredSpecies).length > 0) {
        setLoading(true);
        await fetchMinimumDistancesForSpecies(filteredSpecies, location.latitude, location.longitude);
        setLoading(false);
      }
    };
    
    
    organizeSpeciesData();
    getLocation();
    fetchDistances();
    
  }, []);

  useEffect(() => {
    const fetchDistances = async () => {
      if (location && Object.keys(filteredSpecies).length > 0) {
        setLoading(true);
        await fetchMinimumDistancesForSpecies(filteredSpecies, location.latitude, location.longitude);
        setLoading(false);
      }
    };
  
    fetchDistances();
  }, [location, filteredSpecies]);

  const fetchMinimumDistancesForSpecies = async (
    species: { [key: number]: string },
    lat: number,
    lng: number
  ) => {
    let radius = 2;
    let speciesMinDistances: { [key: number]: number | null } = {};
    let remainingIds = Object.keys(species).map(Number);

    try {
      while (remainingIds.length > 0 && radius <= 32) {
        const taxonIdsString = remainingIds.join("%2C");

        const url = `https://api.inaturalist.org/v1/observations?taxon_id=${taxonIdsString}&geoprivacy=open&quality_grade=research&per_page=200&order=desc&order_by=observed_on&lat=${lat}&lng=${lng}&radius=${radius}`;
        const response = await fetch(url);

        if (!response.ok) {
          console.error(`Error fetching observations: ${response.status} ${response.statusText}`);
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
          for (const [taxonId, distance] of Object.entries(foundIds)) {
            speciesMinDistances[Number(taxonId)] = distance;
          }

          remainingIds = nextRemainingIds;
        } else {
          console.error(`Error fetching observations: Received non-JSON response`);
          break;
        }
        radius *= 2;
      }

      for (const id of Object.keys(species).map(Number)) {
        if (!speciesMinDistances[id]) {
          speciesMinDistances[id] = null;
        }
      }

      setSpeciesDistances(speciesMinDistances);
    } catch (error) {
      console.error("Error fetching minimum distances:", error);
    }
  };

  const processObservationsWithRadius = (observations: any, taxonIds: string | any[], userLat: number, userLng: number) => {
    const foundIds: { [taxonId: number]: number } = {};
    const nextRemainingIds = [];

    for (const observation of observations) {
      const taxonId = observation.taxon?.id;
      const locationString = observation.location;

      if (!taxonId || !locationString || !taxonIds.includes(taxonId)) continue;

      const [obsLat, obsLng] = locationString.split(",").map(Number);
      const distance = calculateDistance(userLat, userLng, obsLat, obsLng);

      if (!foundIds[taxonId] || distance < foundIds[taxonId]) {
        foundIds[taxonId] = distance;
      }
    }

    for (const id of taxonIds) {
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

  const filteredSpeciesQuery = useMemo(() => {
    if (!searchQuery) {
      return Object.keys(filteredSpecies).map((taxonId) => ({
        taxonId: Number(taxonId),
        name: filteredSpecies[Number(taxonId)],
        distance: speciesDistances[Number(taxonId)],
      }));
    }

    return Object.keys(filteredSpecies)
      .filter((taxonId) =>
        filteredSpecies[Number(taxonId)]
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
      .map((taxonId) => ({
        taxonId: Number(taxonId),
        name: filteredSpecies[Number(taxonId)],
        distance: speciesDistances[Number(taxonId)],
      }));
  }, [searchQuery, filteredSpecies, speciesDistances]);

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <TextInput
        style={{
          width: "90%",
          padding: 10,
          margin: 10,
          backgroundColor: "#f0f0f0",
          borderRadius: 5,
        }}
        placeholder="Search for species..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <Picker
        selectedValue={selectedMonth}
        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        style={{ width: 200, marginVertical: 20 }}
      >
        {Object.keys(speciesData).map((month) => (
          <Picker.Item key={month} label={month} value={month} />
        ))}
      </Picker>
      {loading ? (
        <ActivityIndicator size="large"/>
      ) : (
        <ThemedFlatList
          data={filteredSpeciesQuery}
          keyExtractor={(item) => item.taxonId.toString()}
          renderItem={({ item }) => (
            <ThemedView
              onTouchEnd={() => {
                router.push({
                  pathname: "/home/PlantLocation",
                  params: {
                    iNaturalistTaxonId: item.taxonId,
                    commonName: item.name,
                    lat: location?.latitude,
                    lng: location?.longitude,
                  },
                });
              }}
            >
              <ThemedText>
                {item.name} -{" "}
                {item.distance !== null
                  ? `Closest Distance: ${Number(item.distance).toFixed(2)} km`
                  : "No observations found near you"}
              </ThemedText>
            </ThemedView>
          )}
        />
      )}
    </ThemedView>
  );
}