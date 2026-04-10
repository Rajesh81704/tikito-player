import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { format, parseISO } from 'date-fns';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Booking } from '@/src/lib/api';

type BookingCardProps = {
  booking: Booking;
  className?: string;
};

export function BookingCard({ booking, className }: BookingCardProps) {
  // Format dates: "08 Apr 2026" and "07 Apr, 07:30 PM"
  const formattedBookingDate = format(
    parseISO(booking.booking_date),
    'dd MMM yyyy',
  );
  const formattedBookedAt = format(
    parseISO(booking.booked_at),
    'dd MMM, hh:mm aa',
  );

  // Format times: stripping milliseconds if necessary or just displaying
  const startTime = booking.start_time.split('.')[0].slice(0, 5);
  const endTime = booking.end_time.split('.')[0].slice(0, 5);

  const isConfirmed = booking.booking_status === 'CONFIRMED';

  return (
    <Pressable
      className={`mb-4 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm ${className}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}
    >
      <View className="p-5">
        {/* Header: Ground Name & Status */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-xl font-black tracking-tight text-slate-900">
              {booking.turf_name}
            </Text>
            <View className="mt-1 flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#64748b" />
              <Text
                className="ml-1 text-xs font-medium text-slate-500"
                numberOfLines={1}
              >
                {booking.turf_address || 'Address not available'}
              </Text>
            </View>
          </View>

          <View
            className={`rounded-full px-3 py-1 ${
              isConfirmed ? 'bg-emerald-50' : 'bg-amber-50'
            }`}
          >
            <Text
              className={`text-[10px] font-bold uppercase tracking-widest ${
                isConfirmed ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {booking.booking_status}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="my-4 h-[1px] bg-slate-50" />

        {/* Details: Date, Time, Price */}
        <View className="flex-row justify-between">
          <View className="gap-y-3">
            <View className="flex-row items-center">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                <Ionicons name="calendar-outline" size={16} color="#059669" />
              </View>
              <View className="ml-3">
                <Text className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                  Date
                </Text>
                <Text className="text-sm font-bold text-slate-800">
                  {formattedBookingDate}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                <Ionicons name="time-outline" size={16} color="#059669" />
              </View>
              <View className="ml-3">
                <Text className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                  Time Slot
                </Text>
                <Text className="text-sm font-bold text-slate-800">
                  {startTime} - {endTime}
                </Text>
              </View>
            </View>
          </View>

          <View className="items-end justify-end">
            <Text className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
              Total Price
            </Text>
            <Text className="text-2xl font-black text-emerald-600">
              ₹{booking.price.toFixed(0)}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer Info */}
      <View className="bg-slate-50 px-5 py-3 flex-row justify-between items-center">
        <Text className="text-[10px] font-medium text-slate-400">
          Booked on {formattedBookedAt}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
      </View>
    </Pressable>
  );
}
