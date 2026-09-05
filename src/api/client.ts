import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'ceo_jwt_token';

const getBaseUrl = () => {
  if (Platform.OS === 'web') return 'http://localhost:5001/api';
  if (Platform.OS === 'android') return 'http://10.0.2.2:5001/api';
  return 'http://172.20.10.7:5001/api';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const saveToken = async (token: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
