// app/home/HomeScreen.tsx
import {
  ThemedButton,
  ThemedFlatList,
  ThemedText,
  ThemedView,
} from "@/components/Themed";
import { useRouter } from "expo-router";
import { useEffect, useState, useMemo, useContext } from "react";
import { Picker } from "@react-native-picker/picker";
import { TextInput, ActivityIndicator, StyleSheet } from "react-native";
import { LocationContext } from "@/hooks/LocationContext";
import HomeListItem from "@/components/HomeListItem";
import { fetchMinimumDistancesForSpecies } from "@/scripts/minSpeciesDistances";
import jsonData from "@/data/edible_plants.json";

const allMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type Month = (typeof allMonths)[number];

type TaxaByMonth = {
  [key in Month]?: { [taxonId: number]: string };
};

export default function HomeScreen() {
  const router = useRouter();

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = allMonths[currentMonthIndex];

  const [selectedMonth, setSelectedMonth] = useState<Month>(currentMonth);
  const { location, setLocation } = useContext(LocationContext);
  const [loading, setLoading] = useState(false);
  const [speciesDistances, setSpeciesDistances] = useState<{
    [key: number]: number | null;
  }>({});
  const [speciesData, setSpeciesData] = useState<TaxaByMonth>({});
  const filteredSpecies = useMemo(
    () => speciesData[selectedMonth] || {},
    [selectedMonth, speciesData]
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const organizeSpeciesData = () => {
      const organizedData: TaxaByMonth = {};
      jsonData.forEach((record) => {
        const month = record["Month Ripe"] as Month;
        const taxonId = record["iNaturalist ID"];
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

    const fetchDistances = async () => {
      if (location && Object.keys(filteredSpecies).length > 0) {
        setLoading(true);
        const newSpeciesDistances = await fetchMinimumDistancesForSpecies(
          filteredSpecies,
          location.latitude,
          location.longitude
        );
        setSpeciesDistances(newSpeciesDistances);
        setLoading(false);
      }
    };

    organizeSpeciesData();
    fetchDistances();
  }, []);

  useEffect(() => {
    const fetchDistances = async () => {
      if (location && Object.keys(filteredSpecies).length > 0) {
        setLoading(true);
        const newSpeciesDistances = await fetchMinimumDistancesForSpecies(
          filteredSpecies,
          location.latitude,
          location.longitude
        );
        setSpeciesDistances(newSpeciesDistances);
        setLoading(false);
      }
    };

    fetchDistances();
  }, [location, filteredSpecies]);

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
    <ThemedView style={styles.mainContainer}>
      <TextInput
        style={styles.searchBar}
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

      {loading && <ActivityIndicator size="large" />}

      {!loading && (
        <ThemedFlatList
          data={filteredSpeciesQuery}
          keyExtractor={(item) => item.taxonId.toString()}
          renderItem={({ item }) => <HomeListItem {...item}></HomeListItem>}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    width: "90%",
    padding: 10,
    margin: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
});
