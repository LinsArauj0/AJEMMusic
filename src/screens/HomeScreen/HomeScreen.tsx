import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import RecentlyPlayedCard from "../../components/RecentlyPlayedCard/RecentlyPlayedCard";
import { GenreCard } from "../../components/GenreCard/GenreCard";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/types';
import { MusicPlayerScreen } from "../../components/Song/Song";

import { fetchTopArtists, fetchMusicGenres, fetchPopularArtists, fetchPlaylists, fetchTopTracks } from "../../services/authService";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

interface UserProfile {
  images: { url: string }[];
  display_name: string;
}

interface Track {
  name: string;
  album: { images: { url: string }[] };
}

interface RecentlyPlayedItem {
  track: Track;
}

interface TopArtist {
  id: string
  images: { url: string }[];
  name: string;
}

interface Album {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  artists: { name: string; id: string }[];
  release_date: string;
  total_tracks: number;
  track: Track;
}

interface Genre {
  name: string;
  image?: string;
}

const HomeScreen = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [recentlyplayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [playList, setPlayList] = useState([]);

  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Bom Dia";
    } else if (currentTime < 18) {
      return "Boa Tarde";
    } else {
      return "Boa Noite";
    }
  };

  const message = greetingMessage();

  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    if (!accessToken) {
      console.log("Access token not found");
      return;
    }
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserProfile(data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getRecentlyPlayedSongs = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    if (!accessToken) {
      console.log("Access token not found");
      return;
    }
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=6",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tracks = response.data.items;
      setRecentlyPlayed(tracks);
    } catch (err) {
      console.error("Error fetching recently played songs:", err);
    }
  };

  useEffect(() => {
    getRecentlyPlayedSongs();
  }, []);

  useEffect(() => {
    const getTopArtists = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('token');
        if (!accessToken) {
          console.error('Access token not found');
          return;
        }
        const artists = await fetchTopArtists(accessToken);
        console.log("Top Artists Data:", artists);
        setTopArtists(artists);
      } catch (error) {
        console.error('Error fetching top artists:', error);
      }
    };

    getTopArtists();
  }, []);

  const loadNewReleases = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('token');
      if (!accessToken) {
        console.log('Access token not found');
        return;
      }
      const popularAlbums = await fetchPopularArtists(accessToken);
      setAlbums(popularAlbums);
    } catch (error) {
      console.error('Erro ao carregar os novos lançamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewReleases();
  }, []);

  const loadGenres = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('token');
      if (!accessToken) {
        console.log('Access token not found');
        return;
      }

      const fetchedGenres = await fetchMusicGenres(accessToken);

      if (fetchedGenres && Array.isArray(fetchedGenres)) {
        const limitedGenres = fetchedGenres.slice(0, 12).map((genreName: string) => ({
          name: genreName,
          image: '',
        }));

        setGenres(limitedGenres);
      } else {
        console.error('Estrutura de dados inesperada:', fetchedGenres);
      }
    } catch (error) {
      console.error('Erro ao carregar os gêneros musicais:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    const getPlayList = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('token')
        if (accessToken) {
          const fetchPlayedList = await fetchPlaylists(accessToken);
          console.log('Lista musicas: ', fetchPlayedList)
          setPlayList(fetchPlayedList)
        }
      } catch (error) {
        console.error('Erro ao carregar as play list', error)
      }
    }
    getPlayList();
  }, [])

  useEffect(() => {
    const getTrack = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('token')
        if (accessToken) {
          const fetchTrack = await fetchTopTracks(accessToken);
          console.log('Lista musicas: ', fetchTrack)
          const tracks = fetchTrack.tracks;
          setTopTracks(tracks || []);
        }
      } catch (error) {
        console.error('Erro ao carregar as faixas', error)
      }
    }
    getTrack();
  }, [])

  return (
    <LinearGradient colors={["#102B2D", "#131624"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileContainer}>
          <View style={styles.profileInfo}>
            {userProfile && (
              <Image
                style={styles.profileImage}
                source={{ uri: userProfile.images[0].url }}
              />
            )}
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.greetingText}>{message},</Text>
              <Text style={styles.userName}>{userProfile?.display_name}</Text>
            </View>
          </View>

          <MaterialCommunityIcons name="lightning-bolt-outline" size={24} color="white" />
        </View>

        {/* <View style={styles.categoryContainer}>
          <Pressable style={styles.categoryButton}>
            <Text style={styles.categoryText}>Musicas</Text>
          </Pressable>
          <Pressable style={styles.categoryButton}>
            <Text style={styles.categoryText}>Podcasts & Shows</Text>
          </Pressable>
        </View> */}

        <Text style={styles.sectionTitle}>Gêneros Musicais</Text>
        <FlatList
          data={genres}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => <GenreCard item={item} />}
          numColumns={3}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />

        <Text style={styles.sectionTitle}>Lançamentos</Text>
        <FlatList
          data={albums}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Album }) => (
            <Pressable onPress={() => navigation.navigate('AlbumDetail', { albumId: item.id })}>
              <ArtistCard item={item} />
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.sectionTitle}>Playlist</Text>
        <FlatList
          data={playList}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Album }) => (
            <Pressable onPress={() => navigation.navigate('AlbumDetail', { albumId: item.id })}>
              <ArtistCard item={item} />
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.sectionTitle}>Ouvidas recentes</Text>
        <FlatList
          data={recentlyplayed}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: { item: RecentlyPlayedItem }) => (
            <RecentlyPlayedCard item={item} />
          )}
        />

        <Text style={styles.sectionTitle}>Artistas Top</Text>
        <FlatList
          data={topArtists}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: TopArtist }) => <ArtistCard item={item} />}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.sectionTitle}>Top Tracks</Text>
        {topTracks && topTracks.length > 0 ? (
          <FlatList
            data={topTracks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Text style={{ color: 'white' }}>{item.name}</Text>
            )}
          />
        ) : (
          <Text style={{ color: 'white', textAlign: 'center' }}>Nenhuma faixa disponível</Text>
        )}

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginTop: 50,
  },
  profileContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    justifyContent: 'center'
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  greetingText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  categoryContainer: {
    marginHorizontal: 12,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  categoryButton: {
    backgroundColor: "#3B3B3B",
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
  },
  categoryText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionTitle: {
    marginLeft: 15,
    marginTop: 15,
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export { HomeScreen };
