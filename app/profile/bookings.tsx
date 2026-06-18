import Ionicons from '@expo/vector-icons/Ionicons';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingCard } from '@/src/components/BookingCard';
import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { useMyBookingsQuery } from '@/src/hooks/use-auth';
import { C, radius } from '@/src/lib/theme';

export default function MyBookingsScreen() {
  const bookingsQuery = useMyBookingsQuery(true);

  if (bookingsQuery.isLoading) return <FullScreenLoader label="Fetching your matches..." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['left', 'right', 'bottom']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={bookingsQuery.isRefetching} onRefresh={bookingsQuery.refetch} tintColor={C.gold} />}
      >
        {bookingsQuery.isError ? (
          <View style={{ borderRadius: radius.lg, backgroundColor: 'rgba(224,82,82,0.08)', borderWidth: 1, borderColor: 'rgba(224,82,82,0.2)', padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="alert-circle" size={22} color={C.error} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.error, fontFamily: C.sans }}>
              {bookingsQuery.error instanceof Error ? bookingsQuery.error.message : 'Could not load your bookings.'}
            </Text>
          </View>
        ) : bookingsQuery.data?.length ? (
          bookingsQuery.data.map(b => <BookingCard booking={b} key={b.booking_id} />)
        ) : (
          <View style={{ marginTop: 48, alignItems: 'center', borderRadius: radius.xl, borderWidth: 1, borderColor: C.border, borderStyle: 'dashed', paddingVertical: 56, paddingHorizontal: 32 }}>
            <View style={{ width: 72, height: 72, borderRadius: 999, backgroundColor: C.elevated, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Ionicons name="football-outline" size={36} color={C.border} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif }}>No games scheduled</Text>
            <Text style={{ marginTop: 8, fontSize: 13, textAlign: 'center', color: C.textMuted, lineHeight: 20, fontFamily: C.sans }}>
              Your confirmed turf bookings will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
