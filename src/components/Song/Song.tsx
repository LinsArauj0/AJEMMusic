import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from "expo-linear-gradient";
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');

// Função para configurar o player com a URL da música
const setupPlayer = async (trackUrl: string) => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add({
    id: '1',
    url: trackUrl,
    title: 'Track Title',
    artist: 'Artist Name',
    artwork: 'https://example.com/path-to-album-art',
  });
};

const MusicPlayerScreen: React.FC = () => {
  const [playlist, setPlaylist] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const playbackState = usePlaybackState();

  useEffect(() => {
    fetchSpotifyPlaylist();
  }, []);

  
  const fetchSpotifyPlaylist = async () => {
    const accessToken = await AsyncStorage.getItem("token");

    try {
      const response = await axios.get('https://api.spotify.com/v1/playlists/{playlist_id}', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setPlaylist(response.data);
    } catch (error) {
      console.error('Erro ao buscar a playlist:', error);
    }
  };

  const startTrack = async (track: any) => {
    setCurrentTrack(track);
    await setupPlayer(track.preview_url); // Usando o URL de prévia da faixa

    if (playbackState !== State.Playing) {
      await TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  // Função para pausar ou reproduzir a música
  const togglePlayback = async () => {
    const currentState = await TrackPlayer.getState();
    if (currentState === State.Playing) {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      await TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.playingFrom}>PLAYING FROM PLAYLIST</Text>
        <Text style={styles.playlistTitle}>{playlist ? playlist.name : 'Loading...'}</Text>
      </View>

      {/* Arte do álbum */}
      {currentTrack && (
        <Image
          source={{ uri: currentTrack.album.images[0].url }} // Imagem do álbum da faixa atual
          style={styles.albumArt}
        />
      )}

      {/* Informações da faixa */}
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{currentTrack ? currentTrack.name : 'Select a track'}</Text>
        <Text style={styles.artist}>{currentTrack ? currentTrack.artists[0].name : ''}</Text>
      </View>

      {/* Controles de reprodução */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()}>
          <MaterialIcons name="skip-previous" size={36} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayback}>
          <MaterialIcons
            name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
            size={56}
            color="#1DB954"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
          <MaterialIcons name="skip-next" size={36} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Barra de progresso */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#FFFFFF"
        thumbTintColor="#1DB954"
        value={0.2}
      />

      {/* Tempo da música */}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>0:00</Text>
        <Text style={styles.time}>2:43</Text>
      </View>

      {/* Letra da música */}
      <LinearGradient colors={['#006d63', '#000']} style={styles.lyricsContainer}>
        <ScrollView>
          <Text style={styles.lyrics}>
            {/* Adicione as letras da música aqui */}
          </Text>
        </ScrollView>
      </LinearGradient>

      {/* Lista de faixas da playlist */}
      <ScrollView style={styles.playlistContainer}>
        {playlist?.tracks.items.map((trackItem: any) => (
          <TouchableOpacity key={trackItem.track.id} onPress={() => startTrack(trackItem.track)}>
            <View style={styles.trackItem}>
              <Image source={{ uri: trackItem.track.album.images[0].url }} style={styles.trackImage} />
              <Text style={styles.trackTitle}>{trackItem.track.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
  },
  playingFrom: {
    color: '#888',
    fontSize: 12,
  },
  playlistTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  albumArt: {
    width: width - 40,
    height: width - 40,
    marginVertical: 20,
    alignSelf: 'center',
    borderRadius: 10,
  },
  songInfo: {
    alignItems: 'center',
    marginVertical: 10,
  },
  songTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  artist: {
    color: '#888',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  slider: {
    width: width - 60,
    alignSelf: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  time: {
    color: '#fff',
    fontSize: 12,
  },
  lyricsContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  lyrics: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  playlistContainer: {
    marginVertical: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  trackTitle: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
});

export { MusicPlayerScreen };
