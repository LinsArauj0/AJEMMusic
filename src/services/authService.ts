import axios from 'axios';
import { Buffer } from 'buffer';
import { Linking } from 'react-native';

const CLIENT_ID = '878fbcbf77b54de8bf2950b5ae3509c5'; 
const CLIENT_SECRET = 'ea7d3ad56009461383bf0f932a1352b7';
const REDIRECT_URI = 'exp://localhost:19000/--/auth'; 

export const getAccessToken = async (authCode: string): Promise<string> => {
  try {
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
    console.error('Erro ao obter o token de acesso:', error);
    throw error;
  }
};

export const loginWithSpotify = () => {
  const scopes = 'user-read-private user-read-email';
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
  Linking.openURL(authUrl);
};