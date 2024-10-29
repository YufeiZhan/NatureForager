// app/home/HomeScreen.tsx
import { ThemedButton, ThemedFlatList, ThemedText, ThemedView } from "@/components/Themed";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "expo-router";

import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native";
import PlantList from "@/components/PlantList";
import { oliveGreen, pureWhite } from "@/constants/Colors";

export default function HomeScreen() {
  const router = useRouter();
  type Month = "April" | "May" | "June";

  // todo: should be changed to default current month
  const [selectedMonth, setSelectedMonth] = useState<Month>("April");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [observations, setObservations] = useState<{ [key: number]: any[] }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const speciesData = {
    April: { 133686: "Black Morel", 48502: "Redbud" },
    May: ["placeholder 1"],
    June: ["placeholder 2"],
  };

  const filteredSpecies = useMemo(
    () => speciesData[selectedMonth] || {},
    [selectedMonth]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [allObservations, setAllObservations] = useState<{
    [key: number]: any[];
  }>({});

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // todo: location permission disabled fallback
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      const storedData = await loadStoredObservations(
        Object.keys(filteredSpecies).map(Number)
      );
      if (storedData) {
        setObservations(storedData);
        setAllObservations(storedData);
      }
    })();
  }, [filteredSpecies]);

  const filteredObservations = useMemo(() => {
    if (!searchQuery) return allObservations;

    const filtered = Object.keys(allObservations).reduce((acc, taxonId) => {
      const name =
        typeof filteredSpecies === "object" && !Array.isArray(filteredSpecies)
          ? filteredSpecies[Number(taxonId) as keyof typeof filteredSpecies]
          : undefined;

      if (name && name.toLowerCase().includes(searchQuery.toLowerCase())) {
        acc[Number(taxonId)] = allObservations[Number(taxonId)];
      }
      return acc;
    }, {} as { [key: number]: any[] });

    return filtered;
  }, [searchQuery, allObservations, filteredSpecies]);

  const loadStoredObservations = async (taxonIds: number[]) => {
    try {
      const allObservations: { [key: number]: any[] } = {};
      for (const id of taxonIds) {
        const jsonData = await AsyncStorage.getItem(id.toString());
        if (jsonData) {
          allObservations[id] = JSON.parse(jsonData);
        }
      }
      return allObservations;
    } catch (error) {
      console.error("Error loading stored observations:", error);
    }
    return null;
  };

  const saveObservations = async (taxonId: number, data: any[]) => {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(taxonId.toString(), jsonData);
    } catch (error) {
      console.error(
        `Error saving observations for taxon ID ${taxonId}:`,
        error
      );
    }
  };

  // todo: optimization
  const fetchObservationsForId = async (
    taxonId: number,
    lat: number,
    lng: number,
    radius: number
  ) => {
    const url = `https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&geoprivacy=open&quality_grade=research&per_page=200&order=desc&order_by=observed_on&lat=${lat}&lng=${lng}&radius=${radius}`;
    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          `Error fetching observations for taxon ID ${taxonId}: ${response.status} ${response.statusText}`
        );
        return [];
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        // console.log(data.results)
        return data.results || [];
      } else {
        console.error(
          `Error fetching observations for taxon ID ${taxonId}: Received non-JSON response`
        );
        return [];
      }
    } catch (error) {
      console.error(
        `Error fetching observations for taxon ID ${taxonId}:`,
        error
      );
      return [];
    }
  };

  const fetchAllObservations = async (
    species: { [key: number]: string },
    lat: number,
    lng: number
  ) => {
    let radius = 2;
    let allObservations: { [key: number]: any[] } = {};
    setLoading(true);

    try {
      for (const id of Object.keys(species).map(Number)) {
        let observationsForId: any[] = [];
        radius = 2;

        while (radius <= 32 && observationsForId.length < 200) {
          const results = await fetchObservationsForId(id, lat, lng, radius);
          observationsForId = observationsForId.concat(results);
          radius *= 2;
        }

        allObservations[id] = observationsForId.slice(0, 200);
        await saveObservations(id, observationsForId);
      }

      setObservations(allObservations);
    } catch (error) {
      console.error("Error fetching all observations:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseLocation = (locationString: string): [number, number] => {
    const [latitude, longitude] = locationString.split(",").map(Number);
    return [latitude, longitude];
  };

  const findNearestObservation = (taxonId: number) => {
    if (!location || !observations[taxonId]) return null;

    let nearestObservation = null;
    let minDistance = 33;

    for (const obs of observations[taxonId]) {
      if (!obs.location) continue;
      const [obsLat, obsLng] = parseLocation(obs.location);
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        obsLat,
        obsLng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestObservation = obs;
      }
    }

    return nearestObservation;
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

  useEffect(() => {
    if (location && Object.keys(filteredSpecies).length > 0) {
      fetchAllObservations(
        filteredSpecies,
        location.latitude,
        location.longitude
      );
    }
  }, [location, filteredSpecies]);

  // todo: why justifyContent here doesn't take any effects?
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", backgroundColor: oliveGreen}}
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

      <ThemedFlatList
        data={Object.entries(filteredObservations)}
        keyExtractor={(item) => item[0].toString()}
        renderItem={({ item }) => {
          const taxonId = Number(item[0]);
          const nearest = findNearestObservation(taxonId);
          const distance = nearest
            ? calculateDistance(
                location!.latitude,
                location!.longitude,
                ...parseLocation(nearest.location)
              ).toFixed(2)
            : null;
          const speciesName = (filteredSpecies as Record<number, string>)[
            taxonId
          ];

          return <PlantList taxonId={taxonId} nearest={nearest} distance={distance} speciesName={speciesName} location={location} /> 
        }}
        ListFooterComponent={() => {return <ThemedView style={{alignItems:"center"}}>
                                            <ThemedText style={{color:pureWhite}}> - end -</ThemedText>
                                           </ThemedView>}}
      />

      <ThemedButton
        title="Go to Details"
        onPress={() => router.push("/PlantInfoModal")}
      />
    </ThemedView>
  );
}
