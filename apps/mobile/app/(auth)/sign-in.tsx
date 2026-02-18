import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    // Mock Auth for now
    if (email && password) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Please enter email and password");
    }
  };

  return (
    <View className="flex-1 justify-center px-8 bg-white">
      <View className="items-center mb-10">
        <Text className="text-4xl font-bold text-blue-600 mb-2">IKIGAI</Text>
        <Text className="text-gray-500">Find your place in Tokyo</Text>
      </View>

      <TextInput
        className="w-full bg-gray-100 p-4 rounded-xl mb-4"
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-full bg-gray-100 p-4 rounded-xl mb-6"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="w-full bg-blue-600 p-4 rounded-xl items-center mb-4"
        onPress={handleSignIn}
      >
        <Text className="text-white font-bold text-lg">Sign In</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center gap-1">
        <Text className="text-gray-500">Don't have an account?</Text>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity>
            <Text className="text-blue-600 font-bold">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
