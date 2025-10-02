import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type VideoPlayerProps = {
  uri: string;
  onClose: () => void;
  reel?: boolean;
};

export default function VideoPlayer({ uri, onClose, reel = false }: VideoPlayerProps) {
  // Create player and start playback immediately
  const player = useVideoPlayer(uri, (p) => {
    try {
      p.loop = false;
      p.play();
    } catch (e) {
      // ignore
    }
  });

  // Listen to playing state and status
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const { status } = useEvent(player, 'statusChange', { status: player.status });

  const loading = status === 'loading' || status === 'idle';

  const togglePlay = () => {
    if (!player) return;
    if (player.playing) player.pause();
    else player.play();
  };

  const handleClose = async () => {
    try {
      // release the player explicitly
      player.release();
    } catch (e) {
      // ignore
    }
    onClose();
  };

  return (
    <View style={reel ? styles.containerReel : styles.container}>
      {reel && <StatusBar hidden />}

      <VideoView
        player={player}
        style={reel ? styles.videoReel : styles.video}
        nativeControls={!reel}
        contentFit={reel ? 'cover' : 'contain'}
        // keep allowsPictureInPicture/fullsreen defaults; can be added if needed
      />

      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Starting video...</Text>
        </View>
      )}

      {/* Center play/pause */}
      <View style={styles.overlayCenter} pointerEvents="box-none">
        <TouchableOpacity onPress={togglePlay} style={styles.playPauseButton}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={48} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  containerReel: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  videoReel: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  overlayCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    padding: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    top: 40,
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 8,
  },
});

export { VideoPlayer };
