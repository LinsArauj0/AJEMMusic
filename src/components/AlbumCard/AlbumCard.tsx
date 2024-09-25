import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface Album {
    images: { url: string }[];
    name: string;
    id: string; // Adicione outros campos que você precise
  }
  
interface AlbumCardProps {
  item: Album; // Usando a interface que você definiu
}

const AlbumCard: React.FC<AlbumCardProps> = ({ item }) => {
  return (
    <View style={styles.cardContainer}>
      <Image
        style={styles.albumImage}
        source={{ uri: item.images[0].url }}
      />
      <Text style={styles.albumName}>{item.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    alignItems: "center",
  },
  albumImage: {
    width: 130,
    height: 130,
    borderRadius: 5,
  },
  albumName: {
    fontSize: 13,
    fontWeight: "500",
    color: "white",
    marginTop: 10,
  },
});

export { AlbumCard };
