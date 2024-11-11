// app/(tabs)/profile/SetReminderScreen.tsx
import { ThemedView, ThemedText, ThemedButton, ThemedFlatList } from "@/components/Themed";
import { useState, useEffect } from "react";
import { View, TextInput, FlatList, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import speciesData from "@/data/edible_plants.json";
import { Picker } from "@react-native-picker/picker";

interface Species {
  "iNaturalist ID": number;
  "Scientific Name": string;
  "Common Name": string;
  Type: string;
  "Month Ripe": string;
  Notes: string;
  months?: string[];
}

const aggregateSpecies = (data: Species[]): Species[] => {
  const speciesMap: { [key: number]: Species & { monthsSet: Set<string> } } =
    {};

  data.forEach((item) => {
    const id = item["iNaturalist ID"];
    const month = item["Month Ripe"];

    if (!speciesMap[id]) {
      speciesMap[id] = {
        ...item,
        monthsSet: new Set([month]),
        months: [month], // Initialize months array
      };
    } else {
      speciesMap[id].monthsSet.add(month);
    }
  });

  return Object.values(speciesMap).map((species) => ({
    ...species,
    months: Array.from(species.monthsSet), // Convert Set to array
  }));
};

const saveReminder = async (species: Species) => {
  try {
    const storedData = await AsyncStorage.getItem("savedPlants");
    const savedPlants: { [key: number]: Species } = storedData
      ? JSON.parse(storedData)
      : {};

    const speciesId = species["iNaturalist ID"];
    const existingEntry = savedPlants[speciesId];

    // Ensure months arrays are defined
    const existingMonths = existingEntry?.months ?? [];
    const speciesMonths = species.months ?? [];

    // Combine and deduplicate months
    const updatedMonths = Array.from(
      new Set([...existingMonths, ...speciesMonths])
    );

    // Update or add the species entry
    savedPlants[speciesId] = {
      ...species,
      //   commonName: species["Common Name"],
      months: updatedMonths,
    };

    await AsyncStorage.setItem("savedPlants", JSON.stringify(savedPlants));
    // await AsyncStorage.removeItem("savedPlants");
    console.log(savedPlants);

    Alert.alert(
      "Reminder saved",
      `You'll be reminded about ${species["Common Name"]}.`
    );
  } catch (error) {
    console.error("Error saving reminder:", error);
  }
};

export default function SetReminderScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [frequency, setFrequency] = useState("monthly");

  useEffect(() => {
    const aggregatedData = aggregateSpecies(speciesData);
    if (searchQuery) {
      const filteredSuggestions = aggregatedData.filter((species) =>
        species["Common Name"].toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSelectSpecies = (species: Species) => {
    setSelectedSpecies(species);
    setSearchQuery(species["Common Name"]);
    setSuggestions([]);
  };

  const handleSaveReminder = async () => {
    if (!selectedSpecies) {
      Alert.alert("Please select a species from suggestions.");
      return;
    }
    await saveReminder(selectedSpecies);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Add New Reminder</ThemedText>

      <TextInput
        style={styles.searchBar}
        placeholder="Search for species..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ThemedFlatList
        data={suggestions}
        keyExtractor={(item) => item["iNaturalist ID"].toString()}
        renderItem={({ item }) => (
          <ThemedText onPress={() => handleSelectSpecies(item)}>
            {`${item["Common Name"]} - Ripe in ${item.months?.join(", ")}`}
          </ThemedText>
        )}
      />

      {/* Frequency Picker Dropdown */}
      <Picker
        selectedValue={frequency}
        onValueChange={(itemValue) => setFrequency(itemValue)}
      >
        <Picker.Item label="Monthly" value="monthly" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Daily" value="daily" />
      </Picker>

      {selectedSpecies && (
        <View>
          <ThemedText>
            Selected Species: {selectedSpecies["Common Name"]}
          </ThemedText>
          <ThemedButton title="Save Reminder" onPress={handleSaveReminder} />
        </View>
      )}

      <ThemedButton title="Cancel" onPress={() => router.back()} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchBar: {
    width: "90%",
    padding: 10,
    margin: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  suggestionList: {
    width: "90%",
    maxHeight: 200,
  },
  picker: {
    width: "90%",
    marginVertical: 10,
  },
});
