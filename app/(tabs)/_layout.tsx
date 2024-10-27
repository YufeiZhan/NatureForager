import { Tabs } from "expo-router";

export default function AppLayout(){
    return (
        <Tabs>
            <Tabs.Screen 
                name="home"
            />
            <Tabs.Screen 
                name="profile"
            />
            <Tabs.Screen 
                name="recognition"
            />
        </Tabs>
    )
}