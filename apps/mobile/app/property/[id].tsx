import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock Data
  const property = {
    id,
    title: "Luxury Condo with Tokyo Tower View",
    price: "¥8,500万",
    address: "Shibuya-ku, Tokyo",
    description:
      "A beautiful 2LDK apartment located in the heart of Shibuya. Features modern amenities, floor-to-ceiling windows, and access to a rooftop garden.",
    features: ["2LDK", "80m²", "Built 2020", "South Facing"],
    image: "https://via.placeholder.com/400x300",
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <Image source={{ uri: property.image }} className="w-full h-64" />

        <View className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-bold flex-1 mr-2">{property.title}</Text>
            <Text className="text-xl font-bold text-blue-600">{property.price}</Text>
          </View>

          <Text className="text-gray-500 mb-4 flex-row items-center">
            <Ionicons name="location-outline" size={16} /> {property.address}
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-6">
            {property.features.map((feat, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Feature list is static for display
              <View key={`${feat}-${idx}`} className="bg-gray-100 px-3 py-1 rounded-full">
                <Text className="text-gray-600 text-sm">{feat}</Text>
              </View>
            ))}
          </View>

          <Text className="text-lg font-bold mb-2">Description</Text>
          <Text className="text-gray-600 leading-6 mb-8">{property.description}</Text>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-gray-100 flex-row gap-3 pb-8">
        <TouchableOpacity
          className="flex-1 bg-gray-100 p-4 rounded-xl items-center"
          onPress={() => router.push("/(tabs)/chat")}
        >
          <Text className="text-gray-900 font-bold">Ask AI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-blue-600 p-4 rounded-xl items-center"
          onPress={() => alert("Booking flow...")}
        >
          <Text className="text-white font-bold">Book Viewing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
