import { Redirect } from 'expo-router';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { useAuth } from '@/src/context/AuthContext';

export default function IndexScreen() {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return <FullScreenLoader label="Loading your account..." />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
