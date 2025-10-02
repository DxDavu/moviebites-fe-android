import { categoriesApi } from '@/services/categories';
import { webseriesApi } from '@/services/webseries';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function ExploreScreen() {
  const router = useRouter();
  const socialId = useUserStore((s) => s.socialId);

  const [categories, setCategories] = useState<any[]>([]);
  const [webseries, setWebseries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socialId) {
      router.replace('/login');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const cats = await categoriesApi.getAll({ page: 1, limit: 20 });
        const ws = await webseriesApi.getAll({ page: 1, limit: 20 });
        setCategories((cats as any)?.data || (cats as any) || []);
        setWebseries((ws as any)?.data || (ws as any) || []);
      } catch (err: any) {
        Toast.show({ type: 'error', text1: 'Failed to load explore data', text2: err?.message || JSON.stringify(err) });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [socialId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="mb-2 text-xl font-bold">Categories</Text>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id || item._id || String(item.name)}
        renderItem={({ item }) => (
          <View className="items-center mr-3">
            {item.coverImage?.url ? (
              <Image source={{ uri: item.coverImage.url }} className="w-24 h-24 rounded" />
            ) : (
              <View className="justify-center items-center w-24 h-24 bg-gray-200 rounded">
                <Text>{item.name}</Text>
              </View>
            )}
            <Text className="mt-2">{item.name}</Text>
          </View>
        )}
      />

      <Text className="mt-6 mb-2 text-xl font-bold">WebSeries</Text>
      <FlatList
        data={webseries}
        keyExtractor={(item) => item.w_id || item.w_name || item.slug}
        renderItem={({ item }) => (
          <Pressable
            className="flex-row mb-4"
            onPress={() => router.push({ pathname: '/webseries/[id]', params: { id: encodeURIComponent(item.w_id || item.slug) } })}
          >
            {item.cover_image?.url || item.w_image ? (
              <Image source={{ uri: item.cover_image?.url || item.w_image }} className="mr-3 w-24 h-36 rounded" />
            ) : (
              <View className="mr-3 w-24 h-36 bg-gray-200 rounded" />
            )}
            <View className="flex-1 justify-center">
              <Text className="text-lg font-bold">{item.w_name}</Text>
              <Text className="text-sm text-gray-600">{item.w_sub_title}</Text>
              <Text className="mt-2 text-sm text-gray-600" numberOfLines={2}>{item.w_description}</Text>
              <View className="flex-row mt-2">
                {item.trending && <Text className="px-2 py-1 mr-2 text-xs bg-yellow-200 rounded">Trending</Text>}
                {item.top_picks && <Text className="px-2 py-1 text-xs bg-green-200 rounded">Top Pick</Text>}
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
