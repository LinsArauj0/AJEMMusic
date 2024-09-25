import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

type RecentlyPlayedCardProps = {
  item: {
    track: {
      album: {
        images: { url: string }[];
      };
      name: string;
    };
  };
};

type RootStackParamList = {
  Info: { item: any };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Info'>;

const RecentlyPlayedCard: React.FC<RecentlyPlayedCardProps> = ({ item }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Pressable
      onPress={() => navigation.navigate("Info", { item })}
      style={{ margin: 10 }}
    >
      <Image
        style={{ width: 130, height: 130, borderRadius: 5 }}
        source={{ uri: item.track.album.images[0].url }}
      />
      <Text
        numberOfLines={1}
        style={{
          fontSize: 13,
          fontWeight: "500",
          color: "white",
          marginTop: 10,
        }}
      >
        {item?.track?.name}
      </Text>
    </Pressable>
  );
};

export default RecentlyPlayedCard;

const styles = StyleSheet.create({});
