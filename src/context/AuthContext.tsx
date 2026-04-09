import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  type AuthResponse,
  type AuthUser,
  fetchCurrentUser,
  logoutUser,
} from '@/src/lib/api';
import { setUnauthorizedHandler } from '@/src/lib/axios';
import {
  clearStoredLocation,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '@/src/lib/storage';

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  signIn: (authData: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    async function resetAuthState() {
      await clearStoredToken();
      await clearStoredLocation();
      setToken(null);
      setUser(null);
      queryClient.clear();
    }

    setUnauthorizedHandler(resetAuthState);

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [queryClient]);

  useEffect(() => {
    async function hydrateSession() {
      try {
        const storedToken = await getStoredToken();

        if (!storedToken) {
          return;
        }

        setToken(storedToken);

        const profile = await fetchCurrentUser();
        setUser(profile);
      } catch {
        await clearStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsHydrating(false);
      }
    }

    hydrateSession();
  }, []);

  const signIn = async (authData: AuthResponse) => {
    await setStoredToken(authData.access_token);
    setToken(authData.access_token);

    const profile = await fetchCurrentUser();
    setUser(profile);
    queryClient.setQueryData(['auth', 'me'], profile);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      await clearStoredToken();
      await clearStoredLocation();
      setToken(null);
      setUser(null);
      queryClient.clear();
    }
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    isHydrating,
    signIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
