import { Redirect } from 'expo-router';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { useAuth } from '@/src/context/AuthContext';

export default function IndexScreen() {
  const { isHydrating } = useAuth();

  if (isHydrating) {
    return <FullScreenLoader label="Loading your account..." />;
  }

  return <Redirect href="/(tabs)" />;
}
