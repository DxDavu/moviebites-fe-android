import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const router = useRouter();
  const upsert = useUserStore((s) => s.upsert);
  const loading = useUserStore((s) => s.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // If already logged in, go to home
    (async () => {
      const socialId = await (await import('@react-native-async-storage/async-storage')).default.getItem('social_id');
      if (socialId) router.replace('/');
    })();
  }, []);

  const handleLogin = async () => {
    try {
      // For Phase 1 we use upsert to create or update user
      const res = await upsert({ email, password });
      Toast.show({ type: 'success', text1: 'Logged in' });
      router.replace('/');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Login failed', text2: err?.message || JSON.stringify(err) });
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-6">Sign In</Text>
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
        onPress={handleLogin}
        className="w-full bg-blue-500 p-3 rounded items-center"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Sign In / Create Account</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push('/signup')} className="mt-4">
        <Text className="text-blue-500">Create an account</Text>
      </Pressable>
    </View>
  );
}
