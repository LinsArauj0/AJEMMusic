import React, { useState, useEffect, useContext, useRef } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio, AVPlaybackStatus } from "expo-av";
import { debounce } from "lodash";
import SongItem from "../../components/SongItem/SongItem";
import PlayerContext, { PlayerContextType, Track } from "../../components/PlayerContext/PlayerContext";
import { BottomModal, ModalContent } from "react-native-modals";
import { useNavigation } from "@react-navigation/native";

const LikedSongsScreen = () => {
  const colors = ["#27374D", "#1D267D", "#BE5A83", "#212A3E", "#917FB3", "#37306B", "#443C68", "#5B8FB9", "#144272"];

  const navigation = useNavigation();
  const playerContext = useContext<PlayerContextType | undefined>(PlayerContext);

  if (!playerContext) {
    return <Text>Loading...</Text>;
  }

  const { currentTrack, setCurrentTrack } = playerContext;
  const [backgroundColor, setBackgroundColor] = useState("#0A2647");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchedTracks, setSearchedTracks] = useState<Track[]>([]);
  const [input, setInput] = useState("");
  const [savedTracks, setSavedTracks] = useState<Track[]>([]);
  const value = useRef(0);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const fetchSavedTracks = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("token");
        const response = await fetch("https://api.spotify.com/v1/me/tracks?offset=0&limit=50", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the tracks");
        }

        const data = await response.json();
        setSavedTracks(data.items);
      } catch (err) {
        console.error("Error fetching saved tracks:", err);
      }
    };

    fetchSavedTracks();
  }, []);

  useEffect(() => {
    if (savedTracks.length > 0) {
      handleSearch(input);
    }
  }, [savedTracks]);

  const play = async (nextTrack: Track) => {
    const preview_url = nextTrack.track.preview_url;
    try {
      if (currentSound) {
        await currentSound.stopAsync();
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: preview_url },
        { shouldPlay: true, isLooping: false },
        onPlaybackStatusUpdate
      );
      setCurrentSound(sound);
      setIsPlaying(status.isLoaded);
      await sound.playAsync();
    } catch (err) {
      console.error("Error playing track:", err);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setProgress(status.durationMillis ? status.positionMillis / status.durationMillis : 0);
      setCurrentTime(status.positionMillis ?? 0);
      setTotalDuration(status.durationMillis ?? 0);
    }
    if (status.isLoaded && status.didJustFinish) {
      setCurrentSound(null);
      playNextTrack();
    }
  };

  const handlePlayPause = async () => {
    if (currentSound) {
      if (isPlaying) {
        await currentSound.pauseAsync();
      } else {
        await currentSound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSearch = debounce((text: string) => {
    const filteredTracks = savedTracks.filter((item: Track) =>
      item.track.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchedTracks(filteredTracks);
  }, 800);

  const handleInputChange = (text: string) => {
    setInput(text);
    handleSearch(text);
  };

  const playTrack = async () => {
    if (savedTracks.length > 0) {
      setCurrentTrack(savedTracks[0]);
      await play(savedTracks[0]);
    }
  };

  const playNextTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current += 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);
      setBackgroundColor(colors[Math.floor(Math.random() * colors.length)]);
      await play(nextTrack);
    } else {
      console.log("End of playlist");
    }
  };

  const playPreviousTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current -= 1;
    if (value.current >= 0) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);
      await play(nextTrack);
    } else {
      console.log("Beginning of playlist");
    }
  };

  return (
    <>
      <LinearGradient colors={["#614385", "#516395"]} style={styles.gradient}>
        <ScrollView style={styles.scrollView}>
          <Pressable onPress={() => navigation.goBack()} style={styles.goBackButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <Pressable style={styles.searchContainer}>
            <Pressable style={styles.searchBox}>
              <AntDesign name="search1" size={20} color="white" />
              <TextInput
                value={input}
                onChangeText={handleInputChange}
                placeholder="Find in Liked songs"
                placeholderTextColor="white"
                style={styles.input}
              />
            </Pressable>
            <Pressable style={styles.sortButton}>
              <Text style={styles.sortText}>Sort</Text>
            </Pressable>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Liked Songs</Text>
            <Text style={styles.headerSubtitle}>Your liked songs from Spotify</Text>
          </View>

          <View style={styles.controls}>
            <Pressable onPress={playPreviousTrack}>
              <FontAwesome name="step-backward" size={20} color="white" />
            </Pressable>
            <Pressable onPress={handlePlayPause} style={styles.playButton}>
              <FontAwesome name={isPlaying ? "pause" : "play"} size={30} color="white" />
            </Pressable>
            <Pressable onPress={playNextTrack} style={styles.shuffleButton}>
              <FontAwesome name="step-forward" size={20} color="white" />
            </Pressable>
          </View>

          <FlatList
            data={searchedTracks.length > 0 ? searchedTracks : savedTracks}
            keyExtractor={(item) => item.track.id}
            renderItem={({ item }) => <SongItem song={item} />}
          />
        </ScrollView>
      </LinearGradient>

      <BottomModal
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(false)}
        height={0.5}
      >
        <ModalContent>
          <Text>Modal Content Here</Text>
        </ModalContent>
      </BottomModal>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  goBackButton: {
    marginTop: 30,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    padding: 10,
    flex: 1,
  },
  input: {
    color: "white",
    marginLeft: 10,
    flex: 1,
  },
  sortButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b3b3b",
    borderRadius: 20,
    padding: 10,
  },
  sortText: {
    color: "white",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    color: "white",
  },
  headerSubtitle: {
    color: "white",
    marginTop: 5,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  shuffleButton: {
    marginHorizontal: 20,
  },
  playButton: {
    marginHorizontal: 20,
  },
});

export { LikedSongsScreen };