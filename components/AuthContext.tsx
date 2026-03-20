import type React from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

type AuthContextValue = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Fake auth for now: start logged out and toggle when OTP is verified.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const value = useMemo<AuthContextValue>(
    () => ({ isLoggedIn, setIsLoggedIn }),
    [isLoggedIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
