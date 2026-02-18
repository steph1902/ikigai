import { View, Text, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PropertyCardProps {
    id: string;
    name: string;
    price: string;
    location: string;
    size: string;
    layout: string;
    imageUrl: string;
}

export function PropertyCard({
    id,
    name,
    price,
    location,
    size,
    layout,
    imageUrl,
}: PropertyCardProps) {
    return (
        <Link href={`/property/${id}`} asChild>
            <TouchableOpacity className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <View className="h-48 w-full bg-gray-200">
                    <Image
                        source={{ uri: imageUrl }}
                        className="h-full w-full"
                        resizeMode="cover"
                    />
                </View>

                <View className="p-4">
                    <View className="mb-2 flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                                {name}
                            </Text>
                            <View className="mt-1 flex-row items-center">
                                <MaterialCommunityIcons name="map-marker" size={14} color="#6B7280" />
                                <Text className="ml-1 text-xs text-gray-500" numberOfLines={1}>
                                    {location}
                                </Text>
                            </View>
                        </View>
                        <Text className="text-lg font-bold text-indigo-900">{price}</Text>
                    </View>

                    <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons name="floor-plan" size={16} color="#6B7280" />
                            <Text className="ml-1 text-sm text-gray-600">{layout}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons name="ruler" size={16} color="#6B7280" />
                            <Text className="ml-1 text-sm text-gray-600">{size}</Text>
                        </View>
                        <View className="rounded-full bg-indigo-50 px-3 py-1">
                            <Text className="text-xs font-medium text-indigo-700">Detailed</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
}
