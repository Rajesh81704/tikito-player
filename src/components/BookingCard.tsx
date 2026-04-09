import { format } from 'date-fns';
import { Text, View } from 'react-native';

import { type Booking } from '@/src/lib/api';

function formatTime(value: string) {
  return value.slice(0, 5);
}

function formatBookingDate(value: string) {
  return format(new Date(`${value}T00:00:00`), 'EEEE, MMMM d, yyyy');
}

function formatBookedAt(value: string) {
  return format(new Date(value), 'MMMM d, yyyy');
}

export function BookingCard({ booking }: { booking: Booking }) {
  return (
    <View className="gap-3 rounded-3xl border border-slate-200 bg-white p-5">
      <View className="gap-1">
        <Text className="text-xl font-bold text-slate-900">
          {booking.turf_name}
        </Text>
        <Text className="text-sm text-slate-600">{booking.ground_name}</Text>
      </View>

      <View className="gap-1">
        <Text className="text-sm font-semibold text-slate-500">
          {formatBookingDate(booking.booking_date)}
        </Text>
        <Text className="text-xs text-slate-400">
          Booked on {formatBookedAt(booking.booked_at)}
        </Text>
        <Text className="text-lg font-bold text-teal-700">
          {formatTime(booking.start_time)} -{' '}
          {formatTime(booking.end_time)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between gap-3">
        <View className="rounded-full bg-emerald-50 px-3 py-1.5">
          <Text className="text-xs font-semibold uppercase tracking-[0.5px] text-emerald-700">
            {booking.booking_status}
          </Text>
        </View>
        <Text className="text-base font-semibold text-slate-900">
          ₹ {booking.price}
        </Text>
      </View>
    </View>
  );
}
