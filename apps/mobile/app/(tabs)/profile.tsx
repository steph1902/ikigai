import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50 pt-12 px-4">
      <Text className="text-2xl font-bold mb-8">Profile</Text>

      <View className="bg-white rounded-xl p-4 mb-6">
        <Text className="text-gray-500 mb-1">Signed in as</Text>
        <Text className="text-lg font-medium">user@example.com</Text>
      </View>

      <TouchableOpacity
        className="bg-white p-4 rounded-xl border border-gray-200 mb-2"
        onPress={() => {}}
      >
        <Text className="text-gray-900">Account Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white p-4 rounded-xl border border-gray-200"
        onPress={() => router.replace("/(auth)/sign-in")}
      >
        <Text className="text-red-500">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
