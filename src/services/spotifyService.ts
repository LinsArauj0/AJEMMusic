// spotifyService.ts
import axios, { AxiosInstance } from 'axios';
import { getAccessToken } from './authService';

const BASE_URL = 'https://api.spotify.com/v1';

const createAxiosInstance = (token: string): AxiosInstance => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Tipo para a resposta de uma faixa
export interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  // Adicione mais campos conforme necessário
}

// Tipo para a resposta de um álbum
export interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  // Adicione mais campos conforme necessário
}

export const getTrack = async (trackId: string, authCode: string | null): Promise<Track> => {
  try {
    if (!authCode) {
      throw new Error('Código de autorização não fornecido.');
    }
    
    const token = await getAccessToken(authCode);
    
    if (!token) {
      throw new Error('Token de acesso não obtido.');
    }
    
    const instance = createAxiosInstance(token);
    const response = await instance.get<Track>(`/tracks/${trackId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar a faixa:', error);
    throw error;
  }
};

export const getAlbum = async (albumId: string, authCode: string | null): Promise<Album> => {
  try {
    if (!authCode) {
      throw new Error('Código de autorização não fornecido.');
    }
    
    const token = await getAccessToken(authCode);
    
    if (!token) {
      throw new Error('Token de acesso não obtido.');
    }
    
    const instance = createAxiosInstance(token);
    const response = await instance.get<Album>(`/albums/${albumId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar o álbum:', error);
    throw error;
  }
};
