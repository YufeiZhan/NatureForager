import { Tabs } from "expo-router";
import { StyleSheet, Image } from "react-native";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <Image source={require("@/assets/tab/home-tab-selected.png")} style={styles.icon}/>
                    : <Image source={require("@/assets/tab/home-tab-unselected.png")} style={styles.icon}/>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <Image source={require("@/assets/tab/fav-tab-selected.png")} style={styles.icon}/>
                    : <Image source={require("@/assets/tab/fav-tab-unselected.png")} style={styles.icon}/>
          ),
        }}
      />
      <Tabs.Screen
        name="reminder"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <Image source={require("@/assets/tab/reminder-tab-selected.png")} style={styles.icon}/>
                    : <Image source={require("@/assets/tab/reminder-tab-unselected.png")} style={styles.icon}/>
          ),
        }}
      />
      <Tabs.Screen
        name="recognition"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <Image source={require("@/assets/tab/reminder-tab-selected.png")} style={styles.icon}/>
                    : <Image source={require("@/assets/tab/reminder-tab-unselected.png")} style={styles.icon}/>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 35, // Set the width of the icon
    height: 35, // Set the height of the icon
    resizeMode: "contain", // Optional: controls how the image fits
  },
});
