import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

interface Track {
    name: string;
    id: string;
    duration_ms: number; // Duração em milissegundos
}

interface Album {
    name: string;
    images: { url: string }[];
    artists: { name: string }[];
}

const AlbumDetailScreen: React.FC = () => {
    const route = useRoute();
    const { albumId } = route.params as { albumId: string };

    const [tracks, setTracks] = useState<Track[]>([]);
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAlbumDetails = async () => {
        const accessToken = await AsyncStorage.getItem('token');
        if (!accessToken) {
            setError('Access token not found');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setAlbum(response.data);
            setTracks(response.data.tracks.items);
        } catch (error) {
            setError('Failed to fetch album details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbumDetails();
    }, [albumId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {album && (
                <>
                    <Image source={{ uri: album.images[0]?.url }} style={styles.albumArt} />
                    <Text style={styles.albumTitle}>{album.name}</Text>
                    <Text style={styles.artistName}>{album.artists[0].name}</Text>
                </>
            )}
            <FlatList
                data={tracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.trackContainer}>
                        <Text style={styles.trackName}>{item.name}</Text>
                        <Text style={styles.trackDuration}>{(item.duration_ms / 60000).toFixed(2)} min</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#131624',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#131624',
    },
    albumArt: {
        width: 150,
        height: 150,
        marginBottom: 16,
        marginTop: 30,
        justifyContent: 'center'
    },
    albumTitle: {
        fontSize: 24,
        color: 'white',
        marginBottom: 8,
    },
    artistName: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 16,
    },
    trackContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    trackName: {
        fontSize: 18,
        color: 'white',
    },
    trackDuration: {
        fontSize: 14,
        color: 'gray',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export { AlbumDetailScreen };
