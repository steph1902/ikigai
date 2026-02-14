import { View, Text, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const SAVED = [
    { id: '1', title: 'Luxury Condo in Shibuya', price: '¥8,500万', image: 'https://via.placeholder.com/150' },
    { id: '2', title: 'Ebisu Garden Place', price: '¥12,000万', image: 'https://via.placeholder.com/150' },
];

export default function SavedScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-gray-50 pt-12 px-4">
            <Text className="text-2xl font-bold mb-6 text-gray-900">Saved Properties</Text>

            <FlatList
                data={SAVED}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable
                        className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
                        onPress={() => router.push(`/property/${item.id}`)}
                    >
                        <View className="h-40 bg-gray-200" />
                        <View className="p-4">
                            <Text className="text-lg font-bold text-gray-900">{item.price}</Text>
                            <Text className="text-gray-600">{item.title}</Text>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    );
}
