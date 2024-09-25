import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

type ArtistCardProps = {
  item: {
    images: { url: string }[];
    name: string;
  };
};

const ArtistCard: React.FC<ArtistCardProps> = ({ item }) => {
  return (
    <View style={{ margin: 10 }}>
      {item.images.length > 0 ? (
        <Image
          style={{ width: 130, height: 130, borderRadius: 5 }}
          source={{ uri: item.images[0].url }}
        />
      ) : (
        <View style={{ width: 130, height: 130, borderRadius: 5, backgroundColor: 'gray' }} />
      )}
      <Text
        style={{
          fontSize: 13,
          fontWeight: "500",
          color: "white",
          marginTop: 10,
        }}
      >
        {item?.name}
      </Text>
    </View>
  );
};


export default ArtistCard;

const styles = StyleSheet.create({});
