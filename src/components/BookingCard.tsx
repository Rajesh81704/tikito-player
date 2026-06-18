import Ionicons from '@expo/vector-icons/Ionicons';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { C, radius } from '@/src/lib/theme';
import type { Booking } from '@/src/lib/api';

export function BookingCard({ booking }: { booking: Booking }) {
  const formattedDate = format(parseISO(booking.booking_date), 'dd MMM yyyy');
  const formattedBookedAt = format(parseISO(booking.booked_at), 'dd MMM, hh:mm aa');
  const startTime = booking.start_time.split('.')[0].slice(0, 5);
  const endTime = booking.end_time.split('.')[0].slice(0, 5);

  const paymentStatus = (booking as any).payment_status || 'PENDING';
  const isConfirmed = booking.booking_status === 'CONFIRMED' && paymentStatus === 'PAID';
  const isPending = paymentStatus === 'PENDING';
  const isFailed = paymentStatus === 'FAILED';

  const statusLabel = isConfirmed ? 'CONFIRMED' : isFailed ? 'FAILED' : isPending ? 'PENDING' : booking.booking_status;
  const statusColor = isConfirmed ? C.green : isFailed ? C.error : C.warning;
  const statusBg = isConfirmed ? C.greenSoft : isFailed ? 'rgba(224,82,82,0.1)' : 'rgba(232,168,56,0.1)';
  const statusBorder = isConfirmed ? C.greenBorder : isFailed ? 'rgba(224,82,82,0.25)' : 'rgba(232,168,56,0.25)';

  return (
    <Pressable
      style={({ pressed }) => ({
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: C.border,
        backgroundColor: C.card,
        overflow: 'hidden',
        marginBottom: 12,
        opacity: pressed ? 0.92 : 1,
      })}
      onPress={() => router.push({ pathname: '/profile/booking-detail', params: { booking: JSON.stringify(booking) } })}
    >
      <View style={{ padding: 18 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={{ fontSize: 19, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif, letterSpacing: -0.2 }}>
              {booking.turf_name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <Ionicons name="location-outline" size={12} color={C.textMuted} />
              <Text numberOfLines={1} style={{ fontSize: 12, color: C.textMuted, fontFamily: C.sans, flex: 1 }}>
                {booking.turf_address || 'Address unavailable'}
              </Text>
            </View>
          </View>
          <View style={{ borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: statusBg, borderWidth: 1, borderColor: statusBorder }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor, letterSpacing: 0.8, fontFamily: C.sans }}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: C.border, marginVertical: 14 }} />

        {/* Details */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.elevated, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="calendar-outline" size={15} color={C.gold} />
              </View>
              <View>
                <Text style={{ fontSize: 10, fontWeight: '600', color: C.textMuted, letterSpacing: 0.8, fontFamily: C.sans }}>DATE</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.textPrimary, fontFamily: C.sans }}>{formattedDate}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.elevated, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="time-outline" size={15} color={C.gold} />
              </View>
              <View>
                <Text style={{ fontSize: 10, fontWeight: '600', color: C.textMuted, letterSpacing: 0.8, fontFamily: C.sans }}>SLOT</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.textPrimary, fontFamily: C.sans }}>{startTime} – {endTime}</Text>
              </View>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: C.textMuted, letterSpacing: 0.8, fontFamily: C.sans }}>AMOUNT</Text>
            <Text style={{ fontSize: 26, fontWeight: '800', color: C.gold, fontFamily: C.serif }}>
              ₹{Number(booking.price).toFixed(0)}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.elevated, paddingHorizontal: 18, paddingVertical: 10 }}>
        <Text style={{ fontSize: 11, color: C.textMuted, fontFamily: C.sans }}>
          Booked {formattedBookedAt}
        </Text>
        <Ionicons name="chevron-forward" size={15} color={C.textMuted} />
      </View>
    </Pressable>
  );
}
