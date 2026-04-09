import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'tikito-player-auth-token';
const LOCATION_KEY = 'tikito-player-location';

export type StoredLocation = {
  city: string;
  latitude: number;
  longitude: number;
};

const locationListeners = new Set<(location: StoredLocation | null) => void>();

export async function getStoredToken() {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export async function setStoredToken(token: string) {
  return AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function clearStoredToken() {
  return AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function getStoredLocation() {
  const value = await AsyncStorage.getItem(LOCATION_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as StoredLocation;
  } catch {
    return null;
  }
}

export async function setStoredLocation(location: StoredLocation) {
  await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location));
  emitLocationUpdate(location);
}

export async function clearStoredLocation() {
  await AsyncStorage.removeItem(LOCATION_KEY);
  emitLocationUpdate(null);
}

export function subscribeToStoredLocation(
  listener: (location: StoredLocation | null) => void,
) {
  locationListeners.add(listener);

  return () => {
    locationListeners.delete(listener);
  };
}

function emitLocationUpdate(location: StoredLocation | null) {
  for (const listener of locationListeners) {
    listener(location);
  }
}
