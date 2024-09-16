import axios from 'axios';
import { Buffer } from 'buffer';
import { Linking } from 'react-native';

// Configurações do Spotify
const CLIENT_ID = '878fbcbf77b54de8bf2950b5ae3509c5';
const CLIENT_SECRET = 'ea7d3ad56009461383bf0f932a1352b7';
const REDIRECT_URI = 'exp://192.168.0.123:8081/--/auth';

// Função para obter o token de acesso
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
    "user-read-email",
    "user-library-read",
    "user-read-recently-played",
    "user-read-currently-playing",
    "user-top-read",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public"
  ];

  const scopeString = scopes.join(' ');

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopeString)}`;

  console.log('Abrindo URL de autenticação:', authUrl);
  Linking.openURL(authUrl);
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
    console.log('Recently Played Songs:', response.data.items);
    return response.data.items;
  } catch (error) {
    console.error('Erro ao buscar músicas recentemente tocadas:', error);
    throw error;
  }
};

// Função para buscar artistas mais tocados
export const fetchTopArtists = async (accessToken: string) => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/artists',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Top Artists:', response.data.items);
    return response.data.items;
  } catch (error) {
    console.error('Erro ao buscar artistas mais tocados:', error);
    throw error;
  }
};

// Função para buscar faixas mais tocadas
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
    console.log('Top Tracks:', response.data.items);
    return response.data.items;
  } catch (error) {
    console.error('Erro ao buscar faixas mais tocadas:', error);
    throw error;
  }
};

// Função para buscar playlists do usuário
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
    console.log('Playlists:', response.data.items);
    return response.data.items;
  } catch (error) {
    console.error('Erro ao buscar playlists:', error);
    throw error;
  }
};

// Função principal para autenticar e buscar dados
export const handleAuthentication = async (authCode: string) => {
  try {
    const accessToken = await getAccessToken(authCode);
    console.log('Token de Acesso:', accessToken);

    // Buscar músicas recentemente tocadas
    const recentlyPlayed = await fetchRecentlyPlayed(accessToken);
    console.log('Músicas Recentemente Tocadas:', recentlyPlayed);

    // Buscar artistas mais tocados
    const topArtists = await fetchTopArtists(accessToken);
    console.log('Artistas Mais Tocadas:', topArtists);

    // Buscar faixas mais tocadas
    const topTracks = await fetchTopTracks(accessToken);
    console.log('Faixas Mais Tocadas:', topTracks);

    // Buscar playlists
    const playlists = await fetchPlaylists(accessToken);
    console.log('Playlists:', playlists);

  } catch (error) {
    console.error('Erro na autenticação ou na obtenção de dados:', error);
  }
};
