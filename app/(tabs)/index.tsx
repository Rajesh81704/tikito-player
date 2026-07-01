import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { isAfter, isSameDay, parseISO, startOfDay } from 'date-fns';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { BookingCard } from '@/src/components/BookingCard';
import { LocationPermissionModal } from '@/src/components/LocationPermissionModal';
import { HomeHero } from '@/src/components/HomeHero';
import { HomeTurfCard } from '@/src/components/HomeTurfCard';
import { useMyBookingsQuery, useNearbyTurfsQuery, useTurfsQuery } from '@/src/hooks/use-auth';
import { useAuth } from '@/src/context/AuthContext';
import { useStoredLocation } from '@/src/hooks/use-stored-location';
import { setStoredLocation } from '@/src/lib/storage';
import { C, radius } from '@/src/lib/theme';

const LOCATION_TIMEOUT_MS = 10000;
const STATUS_BAR_H = Constants.statusBarHeight || 16;

export default function HomeScreen() {
  const { isAuthenticated } = useAuth();
  const { location, isLoading } = useStoredLocation();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const turfsQuery = useTurfsQuery(location?.city, Boolean(location?.city));
  const nearbyTurfsQuery = useNearbyTurfsQuery(location?.latitude, location?.longitude, Boolean(location?.latitude));
  // Only fetch bookings if user is authenticated
  const bookingsQuery = useMyBookingsQuery(isAuthenticated);

  const upcomingBookings = useMemo(() => {
    const today = startOfDay(new Date());
    return (bookingsQuery.data ?? []).filter((b) => {
      const bd = startOfDay(parseISO(b.booking_date));
      return (isSameDay(bd, today) || isAfter(bd, today)) && b.booking_status === 'CONFIRMED' && (b as any).payment_status === 'PAID';
    });
  }, [bookingsQuery.data]);

  useEffect(() => {
    const checkModal = async () => {
      if (!isLoading && !location) {
        const hasSeen = await AsyncStorage.getItem('hasSeenLocationModal');
        if (!hasSeen) {
          setShowLocationModal(true);
        }
      }
    };
    checkModal();
  }, [isLoading, location]);

  const handleCloseLocationModal = async () => {
    await AsyncStorage.setItem('hasSeenLocationModal', 'true');
    setShowLocationModal(false);
  };

  const handleAcceptLocation = async () => {
    try {
      setIsRequestingLocation(true);
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') { Alert.alert('Permission denied', 'Enable location to see nearby turfs.'); handleCloseLocationModal(); return; }
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) { Alert.alert('Location off', 'Turn on location services and try again.'); return; }
      const last = await Location.getLastKnownPositionAsync();
      const pos = last ?? await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error('Location request timed out.')), LOCATION_TIMEOUT_MS)),
      ]);
      const geo = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      const place = geo[0];
      const city = place?.city ?? place?.subregion ?? place?.district ?? place?.region ?? 'Your city';
      await setStoredLocation({ city, latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      handleCloseLocationModal();
    } catch (err) {
      Alert.alert('Could not fetch location', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setIsRequestingLocation(false);
    }
  };

  if (isLoading) return <FullScreenLoader label="Loading your city..." />;

  const turfs = (nearbyTurfsQuery.data?.length ?? 0) > 0 ? null : turfsQuery.data;
  const nearby = nearbyTurfsQuery.data ?? [];

  return (
    <>
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={{ paddingTop: STATUS_BAR_H + 8, paddingHorizontal: 20, paddingBottom: 14, backgroundColor: C.bg, borderBottomWidth: 0.5, borderBottomColor: C.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 30, fontWeight: '800', color: C.gold, fontFamily: C.serif, letterSpacing: -0.8 }}>
              Tikito.
            </Text>
            {location && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.elevated, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full, borderWidth: 1, borderColor: C.border }}>
                <Ionicons name="location-sharp" size={12} color={C.green} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.textPrimary, fontFamily: C.sans }}>{location.city}</Text>
              </View>
            )}
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <HomeHero />
          </View>

          {/* Nearby / City Turfs */}
          <View style={{ marginTop: 32 }}>
            <View style={{ paddingHorizontal: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif, letterSpacing: -0.3 }}>
                {nearby.length > 0 ? 'Nearby Turfs' : 'Explore Turfs'}
              </Text>
              <Pressable onPress={() => router.push('/(tabs)/discover')}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.gold, fontFamily: C.sans }}>View All</Text>
              </Pressable>
            </View>

            {!location ? (
              <View style={{ marginHorizontal: 20, borderRadius: radius.xl, borderWidth: 1, borderColor: C.border, borderStyle: 'dashed', paddingVertical: 40, alignItems: 'center' }}>
                <Ionicons name="map-outline" size={32} color={C.border} />
                <Text style={{ marginTop: 10, fontSize: 13, fontWeight: '600', color: C.textMuted, fontFamily: C.sans }}>Enable location to see nearby turfs</Text>
              </View>
            ) : nearbyTurfsQuery.isLoading || turfsQuery.isLoading ? (
              <ActivityIndicator color={C.gold} style={{ paddingVertical: 40 }} />
            ) : nearby.length > 0 ? (
              <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
                {nearby.map((turf) => (
                  <View key={turf.turf_field_id} style={{ width: 260 }}>
                    <Pressable
                      onPress={() => router.push({ pathname: '/turf/[turfId]', params: { turfId: turf.turf_field_id, turf: JSON.stringify({ ...turf, no_of_grounds: null, turf_facilities: null, turf_rules: null, turf_images: null }) } })}
                      style={({ pressed }) => ({ borderRadius: radius.xl, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, padding: 16, transform: [{ scale: pressed ? 0.97 : 1 }] })}
                    >
                      <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif }}>{turf.turf_name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                        <Ionicons name="location" size={13} color={C.green} />
                        <Text numberOfLines={1} style={{ fontSize: 12, color: C.textSecondary, fontFamily: C.sans, flex: 1 }}>{turf.turf_address || turf.turf_location || 'Nearby'}</Text>
                      </View>
                      <View style={{ marginTop: 10, alignSelf: 'flex-start', borderRadius: radius.full, backgroundColor: C.greenSoft, borderWidth: 1, borderColor: C.greenBorder, paddingHorizontal: 10, paddingVertical: 5 }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: C.green, fontFamily: C.sans }}>{turf.distance_km} km away</Text>
                      </View>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            ) : turfs?.length ? (
              <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
                {turfs.map((turf) => (
                  <View key={turf.turf_field_id} style={{ width: 260 }}>
                    <HomeTurfCard turf={turf} onPress={() => router.push({ pathname: '/turf/[turfId]', params: { turfId: turf.turf_field_id, turf: JSON.stringify(turf) } })} />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={{ marginHorizontal: 20, borderRadius: radius.xl, borderWidth: 1, borderColor: C.border, borderStyle: 'dashed', paddingVertical: 40, alignItems: 'center' }}>
                <Ionicons name="football-outline" size={32} color={C.border} />
                <Text style={{ marginTop: 10, fontSize: 13, fontWeight: '600', color: C.textMuted, fontFamily: C.sans }}>No turfs available in your area</Text>
              </View>
            )}
          </View>

          {/* Upcoming Bookings */}
          {isAuthenticated && (
          <View style={{ marginTop: 36 }}>
            <View style={{ paddingHorizontal: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif, letterSpacing: -0.3 }}>Your Schedule</Text>
              <Pressable onPress={() => router.push('/profile/bookings')}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.gold, fontFamily: C.sans }}>View All</Text>
              </Pressable>
            </View>

            {bookingsQuery.isLoading ? (
              <ActivityIndicator color={C.gold} style={{ paddingVertical: 40 }} />
            ) : upcomingBookings.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
                {upcomingBookings.map((b) => (
                  <View key={b.booking_id} style={{ width: 280 }}>
                    <BookingCard booking={b} />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={{ marginHorizontal: 20, borderRadius: radius.xl, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, padding: 28, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif }}>No upcoming games</Text>
                <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 6, fontFamily: C.sans }}>Book your first match today.</Text>
              </View>
            )}
          </View>
          )}
        </ScrollView>
      </View>

      <LocationPermissionModal loading={isRequestingLocation} onAccept={handleAcceptLocation} onClose={handleCloseLocationModal} visible={showLocationModal} />
    </>
  );
}
