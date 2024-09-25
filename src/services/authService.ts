import axios from 'axios';
import { Buffer } from 'buffer';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID = '878fbcbf77b54de8bf2950b5ae3509c5';
const CLIENT_SECRET = 'ea7d3ad56009461383bf0f932a1352b7';
const REDIRECT_URI = 'exp://192.168.0.3:8081/--/auth';

export const getAccessToken = async (authCode: string): Promise<string> => {
  try {
    console.log('Tentando obter o token de acesso...');
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na resposta da API:', error.response?.data);
    } else if (error instanceof Error) {
      console.error('Erro:', error.message);
    } else {
      console.error('Erro desconhecido:', error);
    }
    throw error;
  }
};

export const loginWithSpotify = () => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "user-library-modify",
    "playlist-read-private",
    "playlist-modify-private",
    "playlist-modify-public",
    "playlist-read-collaborative",
    "user-read-recently-played",
    "user-top-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "app-remote-control",
    "streaming",
    "user-follow-read",
    "user-follow-modify"
  ];
  
  const scopeString = scopes.join(' ');

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopeString)}`;

  console.log('Abrindo URL de autenticação:', authUrl);
  Linking.openURL(authUrl);
};

const saveAccessToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('accessToken', token);
    console.log('Access token saved in storage');
  } catch (error) {
    console.error('Error saving access token:', error);
  }
};

export const fetchRecentlyPlayed = async (accessToken: string) => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/player/recently-played',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.items;
  } catch (error) {
    console.error('Erro ao buscar músicas recentemente tocadas:', error);
    throw error;
  }
};

export const fetchTopArtists = async (token: string) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching top artists:', error);
    return [];
  }
};

export const fetchTopTracks = async (accessToken: string) => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/tracks',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Top Tracks:', response.data);
    return response.data.items;
  } catch (error) {
    console.error('Erro ao buscar faixas mais tocadas:', error);
    throw error;
  }
};

export const fetchPlaylists = async (accessToken: string) => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/playlists',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Playlists:', response.data);
    return response.data.items;
  } catch (error) {
    console.error('Erro ao buscar playlists:', error);
    throw error;
  }
};

export const fetchAlbums = async (accessToken: string) => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/albums',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Álbuns:', response.data.items);
    return response.data.items;
  } catch (error) {
    console.error('Erro ao buscar álbuns:', error);
    throw error;
  }
};

export const fetchPopularArtists = async (accessToken: string) => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/browse/new-releases?limit=20',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Novos Lançamentos:', response.data);
    return response.data.albums.items;
  } catch (error) {
    console.error('Erro ao buscar novos lançamentos:', error);
    throw error;
  }
};

export const fetchMusicGenres = async (accessToken: string) => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/recommendations/available-genre-seeds?limit=20',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Gêneros musicais disponíveis:', response.data);
    return response.data.genres;
  } catch (error) {
    console.error('Erro ao buscar gêneros musicais:', error);
    throw error;
  }
};

export const handleAuthentication = async (authCode: string) => {
  try {
    const accessToken = await getAccessToken(authCode);
    await saveAccessToken(accessToken);

    const recentlyPlayed = await fetchRecentlyPlayed(accessToken);
    const topArtists = await fetchTopArtists(accessToken);
    const topTracks = await fetchTopTracks(accessToken);
    const playlists = await fetchPlaylists(accessToken);
    const popularArtists = await fetchPopularArtists(accessToken);

    console.log('Dados recuperados com sucesso:', {
      recentlyPlayed,
      topArtists,
      topTracks,
      playlists,
      popularArtists,
    });

  } catch (error) {
    console.error('Erro na autenticação ou na obtenção de dados:', error);
  }
};
