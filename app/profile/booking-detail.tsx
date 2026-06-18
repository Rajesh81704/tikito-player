import Ionicons from '@expo/vector-icons/Ionicons';
import { format, parseISO } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, radius } from '@/src/lib/theme';
import type { Booking } from '@/src/lib/api';

export default function BookingDetailScreen() {
  const params = useLocalSearchParams<{ booking?: string }>();
  const booking: Booking | null = typeof params.booking === 'string' ? JSON.parse(params.booking) as Booking : null;

  if (!booking) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.textMuted, fontFamily: C.sans }}>Booking not found</Text>
      </SafeAreaView>
    );
  }

  const formattedDate = format(parseISO(booking.booking_date), 'EEEE, dd MMM yyyy');
  const formattedBookedAt = format(parseISO(booking.booked_at), 'dd MMM yyyy, hh:mm a');
  const startTime = booking.start_time.split('.')[0].slice(0, 5);
  const endTime = booking.end_time.split('.')[0].slice(0, 5);
  const paymentStatus = (booking as any).payment_status || 'PENDING';
  const isConfirmed = booking.booking_status === 'CONFIRMED' && paymentStatus === 'PAID';
  const isPending = paymentStatus === 'PENDING';
  const statusLabel = isConfirmed ? 'CONFIRMED' : isPending ? 'PAYMENT PENDING' : booking.booking_status;
  const statusColor = isConfirmed ? C.green : isPending ? C.warning : C.error;
  const statusBg = isConfirmed ? C.greenSoft : isPending ? 'rgba(232,168,56,0.1)' : 'rgba(224,82,82,0.1)';
  const statusBorder = isConfirmed ? C.greenBorder : isPending ? 'rgba(232,168,56,0.25)' : 'rgba(224,82,82,0.25)';

  const handleShare = async () => {
    try {
      await Share.share({ message: `🏟️ Tikito Booking\n\n${statusLabel}\n📍 ${booking.turf_name}\n⚽ ${booking.ground_name}\n📅 ${formattedDate}\n⏰ ${startTime} – ${endTime}\n₹${booking.price}\n\n🆔 ${booking.booking_id}`, title: 'Tikito Booking Receipt' });
    } catch { Alert.alert('Error', 'Could not share.'); }
  };

  const InfoCell = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
    <View style={{ flex: 1, backgroundColor: C.elevated, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: C.border }}>
      <Text style={{ fontSize: 10, fontWeight: '600', color: C.textMuted, letterSpacing: 0.8, marginBottom: 5, fontFamily: C.sans }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: '700', color: accent ? C.gold : C.textPrimary, fontFamily: accent ? C.serif : C.sans }}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Receipt Card */}
        <View style={{ backgroundColor: C.card, borderRadius: radius.xl, borderWidth: 1, borderColor: C.border, padding: 24 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 26, fontWeight: '800', color: C.gold, fontFamily: C.serif }}>Tikito.</Text>
            <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 4, letterSpacing: 1, fontFamily: C.sans }}>BOOKING RECEIPT</Text>
          </View>

          {/* Status */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{ borderRadius: radius.full, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: statusBg, borderWidth: 1, borderColor: statusBorder }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: statusColor, letterSpacing: 1.2, fontFamily: C.sans }}>{statusLabel}</Text>
            </View>
          </View>

          <View style={{ height: 0.5, backgroundColor: C.border, marginBottom: 20 }} />

          {/* Turf */}
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.textPrimary, fontFamily: C.serif, marginBottom: 6 }}>{booking.turf_name}</Text>
          <Text style={{ fontSize: 13, color: C.textSecondary, marginBottom: 14, fontFamily: C.sans }}>{booking.turf_address || 'Address unavailable'}</Text>

          <View style={{ backgroundColor: C.elevated, borderRadius: radius.md, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.textMuted, letterSpacing: 0.8, marginBottom: 5, fontFamily: C.sans }}>GROUND</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: C.textPrimary, fontFamily: C.serif }}>{booking.ground_name}</Text>
          </View>

          {/* Date / Time */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <InfoCell label="DATE" value={formattedDate} />
            <InfoCell label="TIME" value={`${startTime} – ${endTime}`} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <InfoCell label="DAY" value={booking.day_of_week} />
            <InfoCell label="AMOUNT" value={`₹${Number(booking.price).toFixed(0)}`} accent />
          </View>

          <View style={{ height: 0.5, backgroundColor: C.border, marginBottom: 14 }} />

          <Text style={{ fontSize: 11, color: C.textMuted, fontFamily: C.sans }}>Booking ID: {booking.booking_id}</Text>
          <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 4, fontFamily: C.sans }}>Booked on: {formattedBookedAt}</Text>
        </View>
      </ScrollView>

      {/* Share Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.card, borderTopWidth: 0.5, borderTopColor: C.border, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32 }}>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => ({ height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: radius.lg, backgroundColor: C.gold, opacity: pressed ? 0.88 : 1 })}
        >
          <Ionicons name="share-outline" size={20} color={C.bg} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.bg, fontFamily: C.serif }}>Share Receipt</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
