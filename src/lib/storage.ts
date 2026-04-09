import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'tikito-player-auth-token';

export async function getStoredToken() {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export async function setStoredToken(token: string) {
  return AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function clearStoredToken() {
  return AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}
