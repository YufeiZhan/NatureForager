import { Tabs } from "expo-router";
import { StyleSheet, Image } from "react-native";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: { borderRadius: 35,},
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
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
        name="profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <Image source={require("@/assets/tab/profile-tab-selected.png")} style={styles.icon}/>
                    : <Image source={require("@/assets/tab/profile-tab-unselected.png")} style={styles.icon}/>
          ),
        }}
      />
      <Tabs.Screen
        name="recognition"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            focused ? <Image source={require("@/assets/tab/camera-tab-selected.png")} style={styles.icon}/>
                    : <Image source={require("@/assets/tab/camera-tab-unselected.png")} style={styles.icon}/>
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
