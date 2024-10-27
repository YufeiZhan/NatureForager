import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

export default function RootLayout(){
    const mode = useColorScheme()

    return (
        <ThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="PlantInfoModal" options={{ presentation: "modal" }} />
            </Stack>
        </ThemeProvider>
    )
}