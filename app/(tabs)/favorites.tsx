import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function FavoritesScreen() {
  const router = useRouter();
  const socialId = useUserStore((s) => s.socialId);

  useEffect(() => {
    if (!socialId) {
      // redirect to login if not authenticated
      router.replace('/login');
    }
  }, [socialId]);

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-xl font-bold">Favorites</Text>
      <Text className="mt-4 text-center text-gray-600">Your favorite webseries will appear here.</Text>
      <Pressable onPress={() => router.push('/explore')} className="mt-4 p-3 bg-blue-500 rounded">
        <Text className="text-white">Browse Explore</Text>
      </Pressable>
    </View>
  );
}
