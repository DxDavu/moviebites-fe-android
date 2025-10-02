import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function SignupScreen() {
  const router = useRouter();
  const upsert = useUserStore((s) => s.upsert);
  const loading = useUserStore((s) => s.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = async () => {
    try {
      const res = await upsert({ email, password, name });
      Toast.show({ type: 'success', text1: 'Account created' });
      router.replace('/');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Signup failed', text2: err?.message || JSON.stringify(err) });
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-6">Sign Up</Text>
      <TextInput
        className="w-full border p-3 rounded mb-4"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="w-full border p-3 rounded mb-4"
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-full border p-3 rounded mb-4"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        onPress={handleSignup}
        className="w-full bg-green-500 p-3 rounded items-center"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Create Account</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push('/login')} className="mt-4">
        <Text className="text-blue-500">Already have an account? Sign in</Text>
      </Pressable>
    </View>
  );
}
