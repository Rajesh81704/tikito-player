import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTurfById } from '@/hooks/useTurf';

function formatCurrency(value: number) {
  return `₹${value.toFixed(2)}`;
}

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { turfId, amount, method } = useLocalSearchParams<{
    turfId?: string;
    amount?: string;
    method?: string;
  }>();
  const { data: turf } = useTurfById(turfId);
  const payableAmount = Number(amount ?? 0);

  const scale = useRef(new Animated.Value(0.8)).current;
  const pulse = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0.3,
            duration: 1200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();
  }, [pulse, scale]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center">
          <Animated.View
            style={{
              opacity: pulse,
              transform: [
                {
                  scale: pulse.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [1, 1.35],
                  }),
                },
              ],
            }}
            className="absolute h-40 w-40 rounded-full bg-green-100"
          />
          <Animated.View
            style={{ transform: [{ scale }] }}
            className="h-28 w-28 items-center justify-center rounded-full bg-[#16a34a]"
          >
            <Ionicons name="checkmark" size={54} color="#ffffff" />
          </Animated.View>
        </View>

        <Text className="mt-10 text-3xl font-bold text-gray-900">
          Payment Successful
        </Text>
        <Text className="mt-3 text-center text-base font-medium leading-6 text-gray-500">
          {formatCurrency(payableAmount)} paid via {method ?? 'UPI'} for{' '}
          {turf?.name ?? 'your booking'}.
        </Text>

        <View className="mt-8 w-full rounded-[22px] bg-green-50 p-4">
          <Text className="text-xs font-bold uppercase tracking-[1.4px] text-green-700">
            Booking confirmed
          </Text>
          <Text className="mt-2 text-lg font-bold text-gray-900">
            {turf?.name ?? 'Turf booking'}
          </Text>
          <Text className="mt-1 text-sm font-medium text-gray-600">
            Your receipt and booking details are ready.
          </Text>
        </View>
      </View>

      <View className="border-t border-gray-100 bg-white px-4 pb-6 pt-3">
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          className="rounded-[18px] bg-[#16a34a] px-6 py-4 items-center"
        >
          <Text className="text-base font-bold text-white">
            Go to Home Screen
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
