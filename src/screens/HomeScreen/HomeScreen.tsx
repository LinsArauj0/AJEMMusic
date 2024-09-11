import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../routes/types";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import RecentlyPlayedCard from "../../components/RecentlyPlayedCard/RecentlyPlayedCard";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

interface UserProfile {
  images: { url: string }[];
}

interface Track {
  track: {
    name: string;
    album: { images: { url: string }[] };
  };
}

interface Artist {
  name: string;
  images: { url: string }[];
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recentlyplayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  const greetingMessage = (): string => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Good Morning";
    } else if (currentTime < 16) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const message = greetingMessage();

  
  const getProfile = async (): Promise<void> => {
    const accessToken = await AsyncStorage.getItem("token");

    if (!accessToken) {
     
      navigation.navigate("LoginScreen");
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
      console.log(err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getRecentlyPlayedSongs = async (): Promise<void> => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played?limit=4",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const tracks = response.data.items;
      setRecentlyPlayed(tracks);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRecentlyPlayedSongs();
  }, []);

  const renderItem = ({ item }: { item: Track }) => {
    return (
      <Pressable
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 8,
          backgroundColor: "#282828",
          borderRadius: 4,
          elevation: 3,
        }}
      >
        <Image
          style={{ height: 55, width: 55 }}
          source={{ uri: item.track.album.images[0].url }}
        />
        <View style={{ flex: 1, marginHorizontal: 8, justifyContent: "center" }}>
          <Text
            numberOfLines={2}
            style={{ fontSize: 13, fontWeight: "bold", color: "white" }}
          >
            {item.track.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    const getTopItems = async (): Promise<void> => {
      try {
        const accessToken = await AsyncStorage.getItem("token");
        if (!accessToken) {
          console.log("Access token not found");
          return;
        }
        const response = await axios.get(
          `https://api.spotify.com/v1/me/top/artists`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTopArtists(response.data.items);
      } catch (err) {
        console.log(err);
      }
    };

    getTopItems();
  }, []);

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        {/* Saudação e imagem do perfil */}
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {userProfile?.images[0]?.url && (
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  resizeMode: "cover",
                }}
                source={{ uri: userProfile.images[0].url }}
              />
            )}
            <Text
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {message}
            </Text>
          </View>

          <MaterialCommunityIcons
            name="lightning-bolt-outline"
            size={24}
            color="white"
          />
        </View>

        {/* Lista de músicas recentemente tocadas */}
        <FlatList
          data={recentlyplayed}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />

        {/* Artistas principais do usuário */}
        <Text
          style={{
            color: "white",
            fontSize: 19,
            fontWeight: "bold",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          Your Top Artists
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topArtists.map((item, index) => (
            <ArtistCard item={item} key={index} />
          ))}
        </ScrollView>

        {/* Músicas recentemente tocadas (Scroll horizontal) */}
        <Text
          style={{
            color: "white",
            fontSize: 19,
            fontWeight: "bold",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          Recently Played
        </Text>
        <FlatList
          data={recentlyplayed}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <RecentlyPlayedCard item={item} />}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export { HomeScreen };

const styles = StyleSheet.create({});
