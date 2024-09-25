import React from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const explorerData = [
  {
    id: "1",
    title: "Top Hits",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: "2",
    title: "New Releases",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: "3",
    title: "Discover Weekly",
    image: "https://via.placeholder.com/300x200",
  },
];

const ExplorerScreen = () => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#102B2D", "#131624"]}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Explore</Text>
        <FlatList
          data={explorerData}
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
    paddingTop: 50,
  },
  header: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 20,
  },
  image: {
    width: width - 40, 
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    color: "#fff", 
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
});

export { ExplorerScreen };
