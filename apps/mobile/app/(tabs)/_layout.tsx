import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "#2563eb", headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Explore",
                    tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: "Saved",
                    tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: "AI Assistant",
                    tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
