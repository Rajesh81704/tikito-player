import { router, useLocalSearchParams, Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { useAuth } from '@/src/context/AuthContext';
import {
  useBookSlotMutation,
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
} from '@/src/hooks/use-auth';
import type { AvailableSlot } from '@/src/lib/api';
import { getStoredToken } from '@/src/lib/storage';

function formatTime(value: string) {
  return value.slice(0, 5);
}

function formatDateLabel(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  });
}

export default function BookScreen() {
  const { isAuthenticated } = useAuth();
  const params = useLocalSearchParams<{
    turfId?: string;
    groundId?: string;
    turfName?: string;
    groundName?: string;
    slots?: string;
  }>();

  const bookSlotMutation = useBookSlotMutation();
  const createOrderMutation = useCreatePaymentOrderMutation();
  const verifyPaymentMutation = useVerifyPaymentMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedSlots =
    typeof params.slots === 'string'
      ? (JSON.parse(params.slots) as AvailableSlot[])
      : [];

  const totalAmount = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);

  if (!selectedSlots.length) {
    return <FullScreenLoader label="Loading booking details..." />;
  }

  const handleConfirmAndPay = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Book all selected slots
      const bookingResults = await Promise.all(
        selectedSlots.map((slot) =>
          bookSlotMutation.mutateAsync({ slot_id: slot.slot_id }),
        ),
      );

      // Get the first booking ID for payment
      const bookingId = bookingResults[0]?.booking_id;

      if (!bookingId) {
        throw new Error('Booking created but no booking ID returned.');
      }

      // Step 2: Create Razorpay order
      const callbackUrl = Linking.createURL('/payment-success');
      const order = await createOrderMutation.mutateAsync(bookingId);

      // Step 3: Open payment page in browser
      const baseUrl =
        process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.tikito.in';
      const token = await getStoredToken();
      const payUrl = `${baseUrl}/pay?key=${encodeURIComponent(order.key)}&amount=${order.amount}&orderId=${encodeURIComponent(order.order_id)}&bookingId=${encodeURIComponent(bookingId)}&callbackUrl=${encodeURIComponent(callbackUrl)}&token=${encodeURIComponent(token || '')}`;

      console.log('Payment URL:', payUrl);
      console.log('Callback URL:', callbackUrl);

      const result = await WebBrowser.openAuthSessionAsync(
        payUrl,
        'tikito-player://payment-success',
      );

      // Step 4: Handle the result
      console.log('[PAYMENT] WebBrowser result type:', result.type);
      console.log('[PAYMENT] WebBrowser result url:', result.type === 'success' ? result.url : 'N/A');

      if (result.type === 'success' && result.url) {
        // Parse deep link params
        const url = Linking.parse(result.url);
        const orderId = url.queryParams?.orderId as string | undefined;
        const paymentId = url.queryParams?.paymentId as string | undefined;
        const signature = url.queryParams?.signature as string | undefined;
        const returnedBookingId = (url.queryParams?.bookingId as string) || bookingId;

        if (orderId && paymentId && signature) {
          // Verify payment on backend
          await verifyPaymentMutation.mutateAsync({
            booking_id: returnedBookingId,
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
          });

          // Only navigate to success after payment is verified
          router.replace({
            pathname: '/turf/[turfId]/ground/[groundId]/success',
            params: {
              turfId: typeof params.turfId === 'string' ? params.turfId : '',
              groundId:
                typeof params.groundId === 'string' ? params.groundId : '',
              turfName:
                typeof params.turfName === 'string' ? params.turfName : '',
              groundName:
                typeof params.groundName === 'string' ? params.groundName : '',
            },
          });
        } else {
          // Deep link came back without payment params
          Alert.alert(
            'Payment incomplete',
            'Payment was not completed. Your booking is pending.',
            [
              {
                text: 'Go to Bookings',
                onPress: () => router.replace('/profile/bookings'),
              },
              { text: 'OK' },
            ],
          );
        }
      } else if (result.type === 'cancel' || result.type === 'dismiss') {
        // User closed the browser — webhook will handle payment confirmation
        Alert.alert(
          'Payment pending',
          'If you completed the payment, your booking will be confirmed shortly via our server. Check "My Bookings" for status.',
          [
            {
              text: 'Go to Bookings',
              onPress: () => router.replace('/profile/bookings'),
            },
            { text: 'OK' },
          ],
        );
      }
    } catch (error) {
      Alert.alert(
        'Booking failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoginToBook = async () => {
    try {
      await AsyncStorage.setItem(
        'pendingBooking',
        JSON.stringify({
          pathname: '/turf/[turfId]/ground/[groundId]/book',
          params: params,
        })
      );
      router.push('/(auth)/login');
    } catch (err) {
      console.error('Failed to save pending booking', err);
      router.push('/(auth)/login');
    }
  };

  const isPending =
    isProcessing ||
    bookSlotMutation.isPending ||
    createOrderMutation.isPending ||
    verifyPaymentMutation.isPending;

  const buttonLabel = !isAuthenticated
    ? 'Login to pay and book'
    : bookSlotMutation.isPending
      ? 'Booking slots...'
      : createOrderMutation.isPending
        ? 'Creating order...'
        : verifyPaymentMutation.isPending
          ? 'Verifying payment...'
          : 'Pay ₹' + totalAmount;

  return (
    <SafeAreaView
      className="flex-1 bg-surface-bg"
      edges={['left', 'right', 'bottom']}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-5 pb-28 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1 px-1">
          <Text className="text-[26px] font-black tracking-tight text-gold">
            Confirm & Pay
          </Text>
          <Text className="text-sm font-medium text-ink-secondary">
            Review your slots, then proceed to payment.
          </Text>
        </View>

        <View className="gap-4 rounded-2xl border border-surface-border bg-surface-card p-4">
          <View className="flex-row flex-wrap gap-3">
            <View className="min-w-[140px] flex-1 rounded-2xl bg-surface-border px-4 py-3">
              <Text className="text-[11px] font-bold uppercase tracking-[0.7px] text-ink-muted">
                Turf
              </Text>
              <Text className="mt-1 text-base font-black text-gold">
                {typeof params.turfName === 'string' ? params.turfName : 'Turf'}
              </Text>
            </View>

            <View className="min-w-[140px] flex-1 rounded-2xl bg-surface-border px-4 py-3">
              <Text className="text-[11px] font-bold uppercase tracking-[0.7px] text-ink-muted">
                Ground
              </Text>
              <Text className="mt-1 text-base font-black text-gold">
                {typeof params.groundName === 'string'
                  ? params.groundName
                  : 'Ground'}
              </Text>
            </View>
          </View>

          <View className="rounded-2xl border border-surface-border bg-surface-card px-4 py-4">
            <Text className="text-[11px] font-bold uppercase tracking-[0.7px] text-ink-muted">
              Total amount
            </Text>
            <View className="mt-2 flex-row items-end justify-between">
              <Text className="text-[28px] font-black tracking-tight text-gold">
                ₹ {totalAmount}
              </Text>
              <Text className="text-sm font-semibold text-gold">
                {selectedSlots.length} slot
                {selectedSlots.length === 1 ? '' : 's'}
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-3">
          <Text className="px-1 text-sm font-semibold text-gold">
            Selected slots
          </Text>

          {selectedSlots.map((slot) => (
            <View
              className="rounded-2xl border border-surface-border bg-surface-card px-4 py-3"
              key={slot.slot_id}
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-sm font-bold text-gold">
                    {formatDateLabel(slot.date)}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-ink-secondary">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </Text>
                </View>
                <View className="rounded-xl bg-surface-border px-3 py-2">
                  <Text className="text-sm font-black text-gold">
                    ₹ {slot.price}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Payment info */}
        <View className="rounded-2xl border border-surface-border bg-surface-card px-4 py-3">
          <View className="flex-row items-center gap-2">
            <Text className="text-sm">🔒</Text>
            <Text className="text-xs font-medium text-ink-secondary">
              Secured by Razorpay · UPI, Cards, Net Banking accepted
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-surface-border bg-surface-card px-5 pb-6 pt-4">
        <Pressable
          accessibilityRole="button"
          className={`min-h-[56px] flex-row items-center justify-between rounded-2xl px-5 ${
            isPending ? 'bg-surface-elevated' : 'bg-gold-light/90'
          }`}
          disabled={isPending}
          onPress={!isAuthenticated ? handleLoginToBook : handleConfirmAndPay}
          style={({ pressed }) => ({
            transform: [{ scale: pressed && !isPending ? 0.99 : 1 }],
            opacity: isPending ? 1 : pressed ? 0.96 : 1,
          })}
        >
          <View>
            <Text
              className={`text-base font-black tracking-tight ${
                isPending ? 'text-ink-secondary' : 'text-pitch-dim'
              }`}
            >
              {buttonLabel}
            </Text>
            <Text
              className={`text-xs font-semibold ${
                isPending ? 'text-ink-secondary' : 'text-gold'
              }`}
            >
              {selectedSlots.length} slot
              {selectedSlots.length === 1 ? '' : 's'} · Secure payment
            </Text>
          </View>

          <View
            className={`h-9 w-9 items-center justify-center rounded-full ${
              isPending ? 'bg-surface-border' : 'bg-gold/20'
            }`}
          >
            <Text
              className={`text-lg font-black ${
                isPending ? 'text-ink-secondary' : 'text-gold'
              }`}
            >
              →
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
