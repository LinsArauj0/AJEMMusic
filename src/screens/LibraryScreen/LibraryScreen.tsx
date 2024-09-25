import React from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const libraryData = [
  {
    id: "1",
    title: "Liked Songs",
    description: "Playlist • 340 songs",
    image: "https://via.placeholder.com/150", 
  },
  {
    id: "2",
    title: "Daily Mix 1",
    description: "Mix • Various Artists",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    title: "Chill Vibes",
    description: "Playlist • 50 songs",
    image: "https://via.placeholder.com/150",
  },
];

const LibraryScreen = () => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <MaterialIcons name="more-vert" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#102B2D", "#131624"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Your Library</Text>
        <FlatList
          data={libraryData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 30,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    color: "#fff", 
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    color: "#B3B3B3",
    fontSize: 14,
  },
});

export { LibraryScreen };
