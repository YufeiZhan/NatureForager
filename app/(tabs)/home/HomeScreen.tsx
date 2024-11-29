// app/home/HomeScreen.tsx
import {
  ThemedFlatList,
  ThemedView,
  ThemedText,
  ThemedTextInput,
  ThemedDropDownPicker,
} from "@/components/Themed";
import { useEffect, useState, useMemo, useContext } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { ActivityIndicator, StyleSheet } from "react-native";
import { LocationContext } from "@/hooks/LocationContext";
import HomeListItem from "@/components/HomeListItem";
import { fetchMinimumDistancesForSpecies } from "@/scripts/minSpeciesDistances";
import jsonData from "@/data/edible_plants.json";
import { oliveGreen, pureWhite } from "@/constants/Colors";

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

export type Month = (typeof allMonths)[number];

type TaxaByMonth = {
  [key in Month]?: { [taxonId: number]: string };
};

export default function HomeScreen() {
  const currentMonthIndex = new Date().getMonth();
  const currentMonth = allMonths[currentMonthIndex];

  const [selectedMonth, setSelectedMonth] = useState<Month>(currentMonth);
  const { location } = useContext(LocationContext);
  const [loading, setLoading] = useState(true);
  const [shown, setShown] = useState(false);
  const [speciesDistances, setSpeciesDistances] = useState<{
    [key: number]: number | null;
  }>({});
  const [speciesData, setSpeciesData] = useState<TaxaByMonth>({});
  const speciesThisMonth = speciesData[selectedMonth] || {};
  const [searchQuery, setSearchQuery] = useState("");

  const [open, setOpen] = useState(false);

  // read in the json data
  useEffect(() => {
    const organizedData: TaxaByMonth = {};

    jsonData.forEach((record) => {
      const month = record["Month Ripe"] as Month;
      const taxonId = record["iNaturalist ID"];
      const commonName = record["Common Name"];
      if (!organizedData[month]) {
        organizedData[month] = {};
      }
      organizedData[month][taxonId] = commonName;
    });

    setSpeciesData(organizedData);
  }, []);

  // get distances to nearest observation of each species
  useEffect(() => {
    const fetchDistances = async () => {
      setLoading(true);
      setShown(false);
      if (location && Object.keys(speciesThisMonth).length > 0) {
        setLoading(true);
        const newSpeciesDistances = await fetchMinimumDistancesForSpecies(
          speciesThisMonth,
          location.latitude,
          location.longitude,
          (taxonId, distance) => {
            // Update distance progressively as it’s fetched
            setSpeciesDistances((prev) => ({
              ...prev,
              [taxonId]: distance,
            }));
          },
          () => {
            // Set shown to true when values start returning
            setShown(true);
          }
        );
        setSpeciesDistances(newSpeciesDistances);
      }
      setLoading(false);
    };
    fetchDistances();
  }, [location, speciesThisMonth]);

  const listItemsToDisplay = useMemo(() => {
    let taxaIdsMatchingSearchQuery = Object.keys(speciesThisMonth);

    if (searchQuery) {
      taxaIdsMatchingSearchQuery = taxaIdsMatchingSearchQuery.filter(
        (taxonId) =>
          speciesThisMonth[Number(taxonId)]
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }
    const items = taxaIdsMatchingSearchQuery.map((taxonId) => ({
      taxonId: Number(taxonId),
      name: speciesThisMonth[Number(taxonId)],
      distance: speciesDistances[Number(taxonId)],
    }));
    const filteredItems = loading
      ? items.filter((item) => item.distance !== undefined)
      : items;

    // Sort items based on the distance value in speciesDistances, placing null distances last
    return filteredItems.sort((a, b) => {
      const distanceA = speciesDistances[a.taxonId];
      const distanceB = speciesDistances[b.taxonId];

      if (distanceA === null) return 1;
      if (distanceB === null) return -1;
      return distanceA - distanceB;
    });
  }, [searchQuery, speciesThisMonth, speciesDistances]);

  // todo: why justifyContent here doesn't take any effects?
  return (
    <ThemedView style={styles.mainContainer}>
      <ThemedTextInput
        style={styles.searchBar}
        placeholder="Search species here e.g. blackberry.."
        placeholderTextColor="gray"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <ThemedDropDownPicker
        open={open}
        value={selectedMonth}
        items={allMonths.map((month) => ({
          label: month,
          value: month,
        }))}
        setOpen={setOpen}
        setValue={setSelectedMonth}
        placeholder="Select Month"
      />

      {shown && (
        <ThemedFlatList
          data={listItemsToDisplay}
          keyExtractor={(item) => item.taxonId.toString()}
          renderItem={({ item }) => <HomeListItem {...item}></HomeListItem>}
          ListFooterComponent={() => {
            return (
              <ThemedView style={{ alignItems: "center" }}>
                <ThemedText style={{ color: pureWhite }}> - end -</ThemedText>
              </ThemedView>
            );
          }}
        />
      )}

      {loading && <ActivityIndicator size="large" />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: oliveGreen,
    padding: 10,
    paddingTop: 20,
  },
  searchBar: {
    width: "100%",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
});
