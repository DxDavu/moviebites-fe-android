import VideoPlayer from '@/components/video/VideoPlayer';
import { webseriesApi } from '@/services/webseries';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function WebseriesDetail() {
  const params = useLocalSearchParams();
  const id = (params.id as string) || '';
  const router = useRouter();

  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Try getById (assume backend supports slug/id)
        try {
          const res = await webseriesApi.getById(id);
          setItem(res?.data || res);
          return;
        } catch (e) {
          // fallback to getBySlug
        }

        try {
          const res = await webseriesApi.getBySlug(id);
          setItem(res?.data || res);
          return;
        } catch (e) {
          // fallback: fetch list and find
        }

        const all = await webseriesApi.getAll({ page: 1, limit: 50 });
        const list = (all as any)?.data || (all as any) || [];
        const found = list.find((w: any) => w.w_id === id || w.slug === id);
        setItem(found || null);
      } catch (err: any) {
        Toast.show({ type: 'error', text1: 'Failed to load series', text2: err?.message || JSON.stringify(err) });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (!item) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-lg">Webseries not found</Text>
      </View>
    );
  }

  const episodes = (item.episodes && item.episodes.length) ? item.episodes : [];

  const handlePlay = (ep: any) => {
    if (ep.is_paid) {
      Toast.show({ type: 'error', text1: 'Episode is paid', text2: 'Purchase required to play this episode.' });
      return;
    }
    setPlayingUrl(ep.url);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      {item.cover_image?.url || item.w_image ? (
        <Image source={{ uri: item.cover_image?.url || item.w_image }} className="mb-4 w-full h-64 rounded" />
      ) : null}

      <Text className="text-2xl font-bold">{item.w_name}</Text>
      <Text className="mt-2 text-sm text-gray-600">{item.w_sub_title}</Text>
      <Text className="mt-3 text-gray-700">{item.w_description}</Text>

      <Text className="mt-6 mb-2 text-xl font-bold">Episodes</Text>
      <FlatList
        data={episodes}
        keyExtractor={(e) => String(e.episode_number)}
        renderItem={({ item: ep }) => (
          <Pressable onPress={() => handlePlay(ep)} className="flex-row items-center p-3 mb-3 bg-gray-100 rounded">
            <View className="flex-1">
              <Text className="font-bold">Episode {ep.episode_number} {ep.title ? `- ${ep.title}` : ''}</Text>
              <Text className="text-sm text-gray-600">{ep.duration ? `${ep.duration} sec` : ''} {ep.is_paid ? ' • Paid' : ''}</Text>
            </View>
            <Text className="text-blue-500">Play</Text>
          </Pressable>
        )}
      />

      <Modal visible={!!playingUrl} animationType="slide">
        {playingUrl && <VideoPlayer uri={playingUrl} onClose={() => setPlayingUrl(null)} reel={true} />}
      </Modal>
    </View>
  );
}
