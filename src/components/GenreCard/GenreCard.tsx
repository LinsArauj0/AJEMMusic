import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface Genre {
  name: string;
  image?: string;
}

interface GenreCardProps {
  item: Genre; // Volta a aceitar um objeto do tipo 'Genre'
}

const GenreCard: React.FC<GenreCardProps> = ({ item }) => {
  return (
    <TouchableOpacity style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#436369',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 60,
    overflow: 'hidden',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
});

export { GenreCard };
