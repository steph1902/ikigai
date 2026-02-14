import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';

// Mock data matches our Tokyo seed data area
const TOKYO_REGION = {
    latitude: 35.6580,
    longitude: 139.7016, // Shibuya
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

const MOCK_PROPERTIES = [
    { id: '1', lat: 35.6580, lng: 139.7016, price: '¥8,500万' },
    { id: '2', lat: 35.6467, lng: 139.7100, price: '¥12,000万' }, // Ebisu
    { id: '3', lat: 35.6653, lng: 139.7121, price: '¥6,200万' },  // Omotesando
];

export default function MapScreen() {
    const router = useRouter();

    return (
        <View className="flex-1">
            <MapView
                style={StyleSheet.absoluteFill}
                initialRegion={TOKYO_REGION}
                showsUserLocation
                provider={PROVIDER_GOOGLE}
            >
                {MOCK_PROPERTIES.map((prop) => (
                    <Marker
                        key={prop.id}
                        coordinate={{ latitude: prop.lat, longitude: prop.lng }}
                        title={prop.price}
                        onCalloutPress={() => router.push(`/property/${prop.id}`)}
                    />
                ))}
            </MapView>

            <View className="absolute top-12 left-4 right-4 z-10">
                <View className="bg-white/90 p-3 rounded-full shadow-md">
                    <Text className="text-gray-500 text-center">Search Tokyo Properties...</Text>
                </View>
            </View>
        </View>
    );
}
