import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { LocationPermissionModal } from '@/src/components/LocationPermissionModal';
import { useStoredLocation } from '@/src/hooks/use-stored-location';
import { setStoredLocation } from '@/src/lib/storage';

const LOCATION_TIMEOUT_MS = 10000;

export default function HomeScreen() {
  const { location, isLoading } = useStoredLocation();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  useEffect(() => {
    if (!isLoading && !location) {
      setShowLocationModal(true);
    }
  }, [isLoading, location]);

  const handleAcceptLocation = async () => {
    try {
      setIsRequestingLocation(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert(
          'Location permission denied',
          'You can enable location later to personalize nearby turf discovery.',
        );
        setShowLocationModal(false);
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        Alert.alert(
          'Location services are off',
          'Turn on location services on the device or emulator, then try again.',
        );
        return;
      }

      const lastKnownPosition = await Location.getLastKnownPositionAsync();

      const currentPosition =
        lastKnownPosition ??
        (await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }),
          new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error('Location request timed out.'));
            }, LOCATION_TIMEOUT_MS);
          }),
        ]));

      const reverseGeocodeResult = await Location.reverseGeocodeAsync({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });

      const place = reverseGeocodeResult[0];
      const city =
        place?.city ??
        place?.subregion ??
        place?.district ??
        place?.region ??
        'Your city';

      await setStoredLocation({
        city,
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });

      setShowLocationModal(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Please try again.';

      Alert.alert(
        'Could not fetch location',
        message === 'Location request timed out.'
          ? 'Location is taking too long. On the Android emulator, open Extended controls > Location and set a mock location, then try again.'
          : message,
      );
    } finally {
      setIsRequestingLocation(false);
    }
  };

  if (isLoading) {
    return <FullScreenLoader label="Loading your city..." />;
  }

  return (
    <>
      <View className="flex-1 justify-center gap-2.5 px-5">
        <Text className="text-3xl font-bold text-slate-900">Home</Text>
        <Text className="text-base leading-6 text-slate-600">
          Your player home is ready for upcoming turf discovery and booking
          features.
        </Text>
        {location ? (
          <Text className="text-sm font-medium text-teal-700">
            Current city: {location.city}
          </Text>
        ) : null}
      </View>

      <LocationPermissionModal
        loading={isRequestingLocation}
        onAccept={handleAcceptLocation}
        onClose={() => setShowLocationModal(false)}
        visible={showLocationModal}
      />
    </>
  );
}
