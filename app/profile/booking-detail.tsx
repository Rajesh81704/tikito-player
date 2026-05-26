import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';

import type { Booking } from '@/src/lib/api';

export default function BookingDetailScreen() {
  const params = useLocalSearchParams<{ booking?: string }>();

  const booking: Booking | null =
    typeof params.booking === 'string'
      ? (JSON.parse(params.booking) as Booking)
      : null;

  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-slate-500">Booking not found</Text>
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
  const statusColor = isConfirmed ? '#059669' : isPending ? '#d97706' : '#ef4444';
  const statusBg = isConfirmed ? '#ecfdf5' : isPending ? '#fffbeb' : '#fef2f2';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏟️ Tikito Booking\n\n✅ ${statusLabel}\n📍 ${booking.turf_name}\n⚽ ${booking.ground_name}\n📅 ${formattedDate}\n⏰ ${startTime} - ${endTime}\n ₹${booking.price}\n\n🆔 ${booking.booking_id}`,
        title: 'Tikito Booking Receipt',
      });
    } catch {
      Alert.alert('Error', 'Could not share.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: '#ffffff', borderRadius: 24, overflow: 'hidden', padding: 24 }}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: '900', color: '#059669' }}>Tikito</Text>
            <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Booking Receipt</Text>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{ backgroundColor: statusBg, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: statusColor, letterSpacing: 1 }}>{statusLabel}</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 }} />

          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#0f172a' }}>{booking.turf_name}</Text>
            <Text style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{booking.turf_address || 'Address not available'}</Text>
            <View style={{ marginTop: 12, backgroundColor: '#f8fafc', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748b' }}>GROUND</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a', marginTop: 2 }}>{booking.ground_name}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94a3b8' }}>DATE</Text>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#0f172a', marginTop: 4 }}>{formattedDate}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94a3b8' }}>TIME</Text>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#0f172a', marginTop: 4 }}>{startTime} - {endTime}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <View style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94a3b8' }}>DAY</Text>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#0f172a', marginTop: 4 }}>{booking.day_of_week}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#ecfdf5', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#059669' }}>AMOUNT</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#059669', marginTop: 4 }}>₹{booking.price}</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#f1f5f9', marginVertical: 8 }} />

          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 11, color: '#94a3b8' }}>Booking ID: {booking.booking_id}</Text>
            <Text style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Booked on: {formattedBookedAt}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32 }}>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => ({ height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, backgroundColor: pressed ? '#064e3b' : '#059669' })}
        >
          <Ionicons name="share-outline" size={20} color="#ffffff" />
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#ffffff' }}>Share Receipt</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
