import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([
        { role: 'system', content: 'Hello! I am your AI real estate assistant. How can I help you today?' }
    ]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white pt-12"
        >
            <View className="px-4 pb-2 border-b border-gray-100">
                <Text className="text-xl font-bold text-center">AI Assistant</Text>
            </View>

            <ScrollView className="flex-1 px-4 py-4">
                {history.map((msg, idx) => (
                    <View key={idx} className={`mb-4 flex-row ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <View className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-blue-600 rounded-tr-none' : 'bg-gray-100 rounded-tl-none'
                            }`}>
                            <Text className={msg.role === 'user' ? 'text-white' : 'text-gray-800'}>
                                {msg.content}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View className="p-4 border-t border-gray-100 flex-row items-center gap-2">
                <TextInput
                    className="flex-1 bg-gray-100 rounded-full px-4 py-3"
                    placeholder="Ask about properties..."
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity className="bg-blue-600 p-3 rounded-full">
                    <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
