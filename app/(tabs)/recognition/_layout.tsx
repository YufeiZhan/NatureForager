import { Stack } from "expo-router";
import globalStyles from "@/styles/globalStyles"

export default function RecognitionLayout() {
    return (
        <Stack
            screenOptions ={{
                headerTitleStyle: { ...globalStyles.headerTitleStyle}
            }}
        >
            <Stack.Screen 
                name="index"
                options={{
                    title: "Plant Recognition",
                }}
            />
        </Stack>
    )
}

