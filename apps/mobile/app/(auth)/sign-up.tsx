import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useState } from 'react';

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        if (name && email && password) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Error', 'Please fill in all fields');
        }
    };

    return (
        <View className="flex-1 justify-center px-8 bg-white">
            <View className="items-center mb-10">
                <Text className="text-4xl font-bold text-blue-600 mb-2">Create Account</Text>
                <Text className="text-gray-500">Join IKIGAI Real Estate</Text>
            </View>

            <TextInput
                className="w-full bg-gray-100 p-4 rounded-xl mb-4"
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />
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
                onPress={handleSignUp}
            >
                <Text className="text-white font-bold text-lg">Sign Up</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center gap-1">
                <Text className="text-gray-500">Already have an account?</Text>
                <Link href="/(auth)/sign-in" asChild>
                    <TouchableOpacity>
                        <Text className="text-blue-600 font-bold">Sign In</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
