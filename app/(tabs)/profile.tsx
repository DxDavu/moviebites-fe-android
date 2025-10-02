import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const socialId = useUserStore((s) => s.socialId);
  const setSocialId = useUserStore((s) => s.setSocialId);

  useEffect(() => {
    if (!socialId) {
      // redirect to login if not authenticated
      router.replace('/login');
    }
  }, [socialId]);

  const handleLogout = async () => {
    await (await import('@react-native-async-storage/async-storage')).default.removeItem('social_id');
    setSocialId(null);
    router.replace('/login');
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-xl font-bold">Profile</Text>
      <Text className="mt-4 text-center text-gray-600">Manage your account and preferences.</Text>
      <Pressable onPress={handleLogout} className="mt-4 p-3 bg-red-500 rounded">
        <Text className="text-white">Logout</Text>
      </Pressable>
    </View>
  );
}
