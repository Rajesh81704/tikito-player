import axios from 'axios';

import { getStoredToken } from '@/src/lib/storage';

type UnauthorizedHandler = (() => Promise<void> | void) | null;

let unauthorizedHandler: UnauthorizedHandler = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.tikito.in',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url || ''}`);
  if (config.data) {
    console.log(`[API Request Body]`, JSON.stringify(config.data, null, 2));
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.baseURL || ''}${response.config.url || ''}`, JSON.stringify(response.data, null, 2));
    return response;
  },
  async (error) => {
    if (error.response?.status === 401 && unauthorizedHandler) {
      await unauthorizedHandler();
    }

    return Promise.reject(error);
  },
);
