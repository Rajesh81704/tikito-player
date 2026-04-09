import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { LocationPermissionModal } from '@/src/components/LocationPermissionModal';
import { TurfCard } from '@/src/components/TurfCard';
import { useTurfsQuery } from '@/src/hooks/use-auth';
import { useStoredLocation } from '@/src/hooks/use-stored-location';
import { setStoredLocation } from '@/src/lib/storage';

const LOCATION_TIMEOUT_MS = 10000;

export default function HomeScreen() {
  const { location, isLoading } = useStoredLocation();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const turfsQuery = useTurfsQuery(location?.city, Boolean(location?.city));

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
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-5 py-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          <Text className="text-3xl font-bold text-slate-900">Home</Text>
          <Text className="text-base leading-6 text-slate-600">
            Discover turf options curated for your current city.
          </Text>
        </View>

        {!location ? (
          <View className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-6">
            <Text className="text-base font-semibold text-slate-900">
              Turn on location to load nearby city turfs.
            </Text>
          </View>
        ) : turfsQuery.isLoading ? (
          <FullScreenLoader label="Loading turfs for your city..." />
        ) : turfsQuery.isError ? (
          <View className="rounded-3xl bg-rose-50 px-5 py-6">
            <Text className="text-base font-semibold text-rose-700">
              {turfsQuery.error instanceof Error
                ? turfsQuery.error.message
                : 'Could not load turfs for your city.'}
            </Text>
          </View>
        ) : turfsQuery.data?.length ? (
          <View className="gap-4">
            {turfsQuery.data.map((turf) => (
              <TurfCard key={turf.turf_field_id} turf={turf} />
            ))}
          </View>
        ) : (
          <View className="rounded-3xl border border-slate-200 bg-white px-5 py-6">
            <Text className="text-base font-semibold text-slate-900">
              No turfs found in {location.city}.
            </Text>
          </View>
        )}
      </ScrollView>

      <LocationPermissionModal
        loading={isRequestingLocation}
        onAccept={handleAcceptLocation}
        onClose={() => setShowLocationModal(false)}
        visible={showLocationModal}
      />
    </>
  );
}
