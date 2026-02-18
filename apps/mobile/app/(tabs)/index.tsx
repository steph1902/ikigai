import { useRouter } from "expo-router";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { PropertyCard } from "../../components/property-card";

// Mock data matches our Tokyo seed data area
const TOKYO_REGION = {
  latitude: 35.658,
  longitude: 139.7016, // Shibuya
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const MOCK_PROPERTIES = [
  {
    id: "1",
    name: "Park Court Shibuya The Tower",
    location: "Shibuya-ku, Tokyo",
    lat: 35.658,
    lng: 139.7016,
    price: "¥8,500万",
    size: "65m²",
    layout: "2LDK",
    imageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Ebisu Garden Place Tower",
    location: "Meguro-ku, Tokyo",
    lat: 35.6467,
    lng: 139.71,
    price: "¥12,000万",
    size: "82m²",
    layout: "3LDK",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Omotesando Hills Residence",
    location: "Minato-ku, Tokyo",
    lat: 35.6653,
    lng: 139.7121,
    price: "¥6,200万",
    size: "45m²",
    layout: "1LDK",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2000&auto=format&fit=crop",
  },
];

export default function MapScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="h-1/2 w-full">
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

        <SafeAreaView className="absolute top-0 left-4 right-4 z-10" edges={['top']}>
          <View className="bg-white/90 p-3 rounded-full shadow-md border border-gray-200">
            <Text className="text-gray-500 text-center font-medium">Search Tokyo Properties...</Text>
          </View>
        </SafeAreaView>
      </View>

      <View className="flex-1 bg-white rounded-t-3xl -mt-6 shadow-lg pt-6 px-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">Featured Listings</Text>
          <Text className="text-sm font-medium text-indigo-600">See All</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {MOCK_PROPERTIES.map((prop) => (
            <PropertyCard
              key={prop.id}
              id={prop.id}
              name={prop.name}
              price={prop.price}
              location={prop.location}
              size={prop.size}
              layout={prop.layout}
              imageUrl={prop.imageUrl}
            />
          ))}
          <View className="h-20" />
        </ScrollView>
      </View>
    </View>
  );
}
