import { useEffect, useState } from 'react';

import {
  getStoredLocation,
  type StoredLocation,
  subscribeToStoredLocation,
} from '@/src/lib/storage';

export function useStoredLocation() {
  const [location, setLocation] = useState<StoredLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadLocation() {
      const storedLocation = await getStoredLocation();

      if (mounted) {
        setLocation(storedLocation);
        setIsLoading(false);
      }
    }

    loadLocation();

    const unsubscribe = subscribeToStoredLocation((nextLocation) => {
      if (mounted) {
        setLocation(nextLocation);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return {
    location,
    isLoading,
  };
}
