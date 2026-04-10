import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { isAfter, isSameDay, parseISO, startOfDay } from 'date-fns';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { BookingCard } from '@/src/components/BookingCard';
import { LocationPermissionModal } from '@/src/components/LocationPermissionModal';
import { HomeHero } from '@/src/components/HomeHero';
import { useMyBookingsQuery, useTurfsQuery } from '@/src/hooks/use-auth';
import { useStoredLocation } from '@/src/hooks/use-stored-location';
import { setStoredLocation } from '@/src/lib/storage';
import { HomeTurfCard } from '@/src/components/HomeTurfCard';

const LOCATION_TIMEOUT_MS = 10000;
const HOME_STATUS_BAR_SPACING = Constants.statusBarHeight || 16;

export default function HomeScreen() {
  const { location, isLoading } = useStoredLocation();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const turfsQuery = useTurfsQuery(location?.city, Boolean(location?.city));
  const bookingsQuery = useMyBookingsQuery(true);
  const upcomingBookings = useMemo(() => {
    const today = startOfDay(new Date());

    return (bookingsQuery.data ?? []).filter((booking) => {
      const bookingDate = startOfDay(parseISO(booking.booking_date));
      return isSameDay(bookingDate, today) || isAfter(bookingDate, today);
    });
  }, [bookingsQuery.data]);

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

  const isWaitingForLocation = !location && showLocationModal;

  return (
    <>
      {isWaitingForLocation ? (
        <View className="flex-1 items-center justify-center gap-3 bg-white px-5">
          <ActivityIndicator color="#10b981" size="large" />
          <Text className="text-base font-bold text-slate-400 uppercase tracking-widest">
            Locating...
          </Text>
        </View>
      ) : (
        <View className="flex-1 bg-white">
          {/* Fixed Header */}
          <View
            style={{ paddingTop: HOME_STATUS_BAR_SPACING }}
            className="bg-white px-5 pb-4 border-b border-slate-100"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-3xl font-black tracking-tighter text-emerald-600">
                Tikito.
              </Text>

              {location && (
                <View className="flex-row items-center">
                  <Ionicons name="location-sharp" size={14} color="#10b981" />
                  <Text className="ml-1 text-sm font-medium text-slate-800">
                    {location.city}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="px-5 mt-4">
              <HomeHero />
            </View>

            {/* Nearby Turfs Section */}
            <View className="mt-8">
              <View className="px-5 mb-4 flex-row items-center justify-between">
                <Text className="text-xl font-black tracking-tight text-slate-900">
                  Explore Nearby Turfs
                </Text>
                <Pressable onPress={() => router.push('/(tabs)/discover')}>
                  <Text className="text-sm font-bold text-emerald-600">
                    View All
                  </Text>
                </Pressable>
              </View>

              {!location ? (
                <View className="mx-5 rounded-3xl border-2 border-dashed border-slate-100 py-10 items-center justify-center">
                  <Ionicons name="map-outline" size={32} color="#cbd5e1" />
                  <Text className="mt-2 text-sm font-bold text-slate-400">
                    Enable location to see nearby turfs
                  </Text>
                </View>
              ) : turfsQuery.isLoading ? (
                <ActivityIndicator color="#10b981" className="py-10" />
              ) : turfsQuery.data?.length === 0 ? (
                <View className="mx-5 rounded-3xl border-2 border-dashed border-slate-100 py-10 items-center justify-center">
                  <Ionicons name="football-outline" size={32} color="#cbd5e1" />
                  <Text className="mt-2 text-sm font-bold text-slate-500">
                    No turfs available in your area
                  </Text>
                  <Text className="text-xs text-slate-400 mt-1">
                    Try exploring nearby cities
                  </Text>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                  {turfsQuery.data?.map((turf, index) => (
                    <View
                      key={turf.turf_field_id}
                      style={{
                        width: 280,
                        marginRight:
                          index === turfsQuery.data.length - 1 ? 0 : 16,
                      }}
                    >
                      <HomeTurfCard
                        turf={turf}
                        onPress={() =>
                          router.push({
                            pathname: '/turf/[turfId]',
                            params: {
                              turfId: turf.turf_field_id,
                              turf: JSON.stringify(turf),
                            },
                          })
                        }
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Upcoming Bookings Section */}
            <View className="mt-10">
              <View className="px-5 mb-4 flex-row items-center justify-between">
                <Text className="text-xl font-black tracking-tight text-slate-900">
                  Your Schedule
                </Text>
                <Pressable onPress={() => router.push('/profile/bookings')}>
                  <Text className="text-sm font-bold text-emerald-600">
                    View Bookings
                  </Text>
                </Pressable>
              </View>

              {bookingsQuery.isLoading ? (
                <ActivityIndicator color="#10b981" className="py-10" />
              ) : upcomingBookings.length ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
                >
                  {upcomingBookings.map((booking) => (
                    <View key={booking.booking_id} style={{ width: 280 }}>
                      <BookingCard booking={booking} />
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View className="mx-5 rounded-[32px] bg-slate-50 p-8 items-center border border-slate-100">
                  <Text className="text-base font-bold text-slate-900">
                    No upcoming games
                  </Text>
                  <Text className="text-sm text-slate-500 mt-1">
                    Book your first match today!
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}

      <LocationPermissionModal
        loading={isRequestingLocation}
        onAccept={handleAcceptLocation}
        onClose={() => setShowLocationModal(false)}
        visible={showLocationModal}
      />
    </>
  );
}
