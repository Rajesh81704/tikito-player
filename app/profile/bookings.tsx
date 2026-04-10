import { ScrollView, Text, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BookingCard } from '@/src/components/BookingCard';
import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { useMyBookingsQuery } from '@/src/hooks/use-auth';

export default function MyBookingsScreen() {
  const bookingsQuery = useMyBookingsQuery(true);

  if (bookingsQuery.isLoading) {
    return <FullScreenLoader label="Fetching your matches..." />;
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['left', 'right', 'bottom']}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={bookingsQuery.isRefetching}
            onRefresh={bookingsQuery.refetch}
            tintColor="#10b981"
          />
        }
      >
        {bookingsQuery.isError ? (
          <View className="rounded-3xl bg-rose-50 p-6 border border-rose-100 flex-row items-center">
            <Ionicons name="alert-circle" size={24} color="#e11d48" />
            <Text className="ml-3 flex-1 text-sm font-bold text-rose-700">
              {bookingsQuery.error instanceof Error
                ? bookingsQuery.error.message
                : 'Could not load your bookings.'}
            </Text>
          </View>
        ) : bookingsQuery.data?.length ? (
          <View>
            {bookingsQuery.data.map((booking) => (
              <BookingCard booking={booking} key={booking.booking_id} />
            ))}
          </View>
        ) : (
          /* Empty State */
          <View className="mt-10 items-center justify-center rounded-[40px] border-2 border-dashed border-slate-100 bg-slate-50/50 px-8 py-16">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm mb-6">
              <Ionicons name="football-outline" size={40} color="#cbd5e1" />
            </View>
            <Text className="text-xl font-black text-slate-900">
              No games scheduled
            </Text>
            <Text className="mt-2 text-center text-sm font-medium leading-5 text-slate-500">
              Ready to hit the field? Your confirmed turf bookings will appear
              here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
