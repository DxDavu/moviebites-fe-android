import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface VideoPlayerProps {
  uri: string;
  onClose: () => void;
}

export default function VideoPlayer({ uri, onClose }: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  return (
    <View className="flex-1 bg-black">
      <Video
        ref={videoRef}
        source={{ uri }}
        className="flex-1"
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={isPlaying}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
          }
        }}
      />
      
      {/* Controls Overlay */}
      <View className="absolute inset-0 justify-center items-center">
        <TouchableOpacity
          onPress={() => setIsPlaying(!isPlaying)}
          className="p-4 rounded-full bg-black/50"
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={48}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Close Button */}
      <TouchableOpacity
        onPress={onClose}
        className="absolute left-4 top-12 p-2 rounded-full bg-black/50"
      >
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}