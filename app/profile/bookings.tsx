import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookingCard } from '@/src/components/BookingCard';
import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { useMyBookingsQuery } from '@/src/hooks/use-auth';

export default function MyBookingsScreen() {
  const bookingsQuery = useMyBookingsQuery(true);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-5 py-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1">
          <Text className="text-3xl font-bold text-slate-900">My Bookings</Text>
          <Text className="text-sm leading-6 text-slate-600">
            All your confirmed bookings in one place.
          </Text>
        </View>

        {bookingsQuery.isLoading ? (
          <FullScreenLoader label="Loading your bookings..." />
        ) : bookingsQuery.isError ? (
          <View className="rounded-3xl bg-rose-50 px-5 py-6">
            <Text className="text-base font-semibold text-rose-700">
              {bookingsQuery.error instanceof Error
                ? bookingsQuery.error.message
                : 'Could not load your bookings.'}
            </Text>
          </View>
        ) : bookingsQuery.data?.length ? (
          <View className="gap-4">
            {bookingsQuery.data.map((booking) => (
              <BookingCard booking={booking} key={booking.booking_id} />
            ))}
          </View>
        ) : (
          <View className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-8">
            <Text className="text-center text-base font-semibold text-slate-900">
              No bookings yet
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
              Once you book a slot, it will show up here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
