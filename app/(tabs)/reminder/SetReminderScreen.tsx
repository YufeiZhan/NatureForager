// app/SetReminderScreen.tsx
import { ThemedView, ThemedText, ThemedFlatList, ThemedTextInput } from "@/components/Themed";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import speciesData from "@/data/edible_plants.json";
import SuggestionListItem from "@/components/SuggestionListItem";
import { pureWhite } from "@/constants/Colors";
import { TempReminderSpecies } from '@/backend/Reminder';

const aggregateSpecies = (data: any[]): TempReminderSpecies[] => {
  const speciesMap: { [key: number]: TempReminderSpecies & { monthsSet: Set<string> } } = {};

  data.forEach((item) => {
    const id = item["iNaturalist ID"];
    const month = item["Month Ripe"];
    const name = item["Common Name"];
    const type = item.Type;

    if (!speciesMap[id]) {
      speciesMap[id] = {
        id,
        name,
        type,
        monthRipe: month,
        monthsSet: new Set([month]),
        months: [],
      };
    } else {
      speciesMap[id].monthsSet.add(month);
    }
  });

  return Object.values(speciesMap).map(({ monthsSet, ...species }) => ({
    ...species,
    months: Array.from(monthsSet),
  }));
};

export default function SetReminderScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TempReminderSpecies[]>([]);

  useEffect(() => {
    const aggregatedData = aggregateSpecies(speciesData);
    if (searchQuery) {
      const filteredSuggestions = aggregatedData.filter((species) =>
        species.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      // set it to the first 100 cuz rendering everything gives a warning
      setSuggestions(aggregatedData.slice(0, 100));
    }
  }, [searchQuery]);

  return (
    <ThemedView style={styles.container}>
      <ThemedTextInput
        style={styles.searchBar}
        placeholder="Search for species..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ThemedFlatList
        data={suggestions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SuggestionListItem
            id={item.id}
            name={item.name}
            months={item.months} 
            type={item.type}        
          />
        )}
        ListFooterComponent={() => (
          <ThemedView style={{ alignItems: "center" }}>
            <ThemedText style={{ color: pureWhite }}> - end -</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
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