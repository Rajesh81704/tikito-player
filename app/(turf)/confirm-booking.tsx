import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTurfById } from '@/hooks/useTurf';

function formatCurrency(value: number) {
  return `₹${value.toFixed(2)}`;
}

export default function ConfirmBookingScreen() {
  const router = useRouter();
  const { turfId, date, slots, hours } = useLocalSearchParams<{
    turfId?: string;
    date?: string;
    slots?: string;
    hours?: string;
  }>();

  const { data: turf, isLoading } = useTurfById(turfId);
  const selectedSlots = (slots ?? '').split('|').filter(Boolean);
  const hoursCount = Number(hours ?? (selectedSlots.length || 0));
  const slotSummary =
    selectedSlots.length > 1
      ? `${selectedSlots[0].split(' - ')[0]} - ${
          selectedSlots[selectedSlots.length - 1].split(' - ')[1]
        }`
      : (selectedSlots[0] ?? '');

  const ticketPrice = (turf?.price ?? 0) * hoursCount;
  const convenienceFee = Number((ticketPrice * 0.18).toFixed(2));
  const supportFee = 2;
  const orderTotal = Number(
    (ticketPrice + convenienceFee + supportFee).toFixed(2),
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center gap-3 border-b border-gray-100 px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
        >
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900">Confirm booking</Text>
      </View>

      {isLoading || !turf ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-gray-500">Loading booking summary...</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerClassName="px-4 pt-3 pb-32">
            <View className="rounded-[22px] bg-white shadow-sm">
              <View className="p-4">
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-2xl font-bold leading-8 text-gray-900">
                      {turf.name}
                    </Text>
                    <Text className="mt-1.5 text-base font-bold text-gray-700">
                      {date}
                    </Text>
                    <Text className="mt-0.5 text-sm font-semibold text-gray-500">
                      {slotSummary}
                    </Text>
                    <Text className="mt-0.5 text-xs font-medium text-gray-400">
                      {hoursCount} hour{hoursCount > 1 ? 's' : ''} booked
                    </Text>
                    <Text className="mt-3 text-sm font-medium text-gray-500">
                      {turf.sports.join(' & ')}
                    </Text>
                    <Text className="mt-1 text-sm font-medium text-gray-500">
                      {turf.address}
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-3xl font-bold text-gray-900">
                      {hoursCount}
                    </Text>
                    <View className="mt-3 flex-row items-center gap-1.5">
                      <Ionicons
                        name="ticket-outline"
                        size={16}
                        color="#ef4444"
                      />
                      <Text className="text-sm font-bold text-[#ef4444]">
                        E-Ticket
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-[#fff8ed] px-3 py-3">
                  <View className="h-8 w-8 items-center justify-center rounded-full border-2 border-[#ef4444]">
                    <Text className="text-xs font-bold text-[#ef4444]">
                      18+
                    </Text>
                  </View>
                  <Text className="flex-1 text-sm font-semibold text-gray-700">
                    Please arrive 15 minutes early and carry a valid ID.
                  </Text>
                </View>
              </View>

              <View className="rounded-b-[22px] bg-[#fdf1e8] px-4 py-3">
                <Text className="text-lg font-bold text-gray-900">
                  Cancellation unavailable
                </Text>
                <Text className="mt-1 text-sm font-medium text-gray-600">
                  This booking cannot be cancelled once confirmed.
                </Text>
              </View>
            </View>

            <View className="mt-4 rounded-[22px] bg-white p-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-gray-500">
                  Slot price
                </Text>
                <Text className="text-base font-semibold text-gray-900">
                  {formatCurrency(ticketPrice)}
                </Text>
              </View>

              <View className="mt-4 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-gray-500">
                  Convenience fees
                </Text>
                <Text className="text-base font-semibold text-gray-900">
                  {formatCurrency(convenienceFee)}
                </Text>
              </View>

              <View className="mt-4 flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-base font-bold text-gray-900">
                    Support local sports
                  </Text>
                  <Text className="mt-1 text-sm font-medium text-gray-500">
                    Add a small contribution to maintain the turf.
                  </Text>
                </View>
                <Text className="text-base font-semibold text-[#ef4444]">
                  {formatCurrency(supportFee)}
                </Text>
              </View>

              <View className="my-4 border-b border-dashed border-gray-300" />

              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold text-gray-900">
                  Order total
                </Text>
                <Text className="text-xl font-bold text-gray-900">
                  {formatCurrency(orderTotal)}
                </Text>
              </View>
            </View>

            <View className="mt-4 rounded-[22px] bg-white p-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-bold text-gray-900">
                  For sending booking details
                </Text>
                <Text className="text-sm font-bold text-[#ef4444]">Edit</Text>
              </View>
              <Text className="mt-3 text-base font-medium text-gray-600">
                +91-7076732126 | amiteshore@gmail.com
              </Text>
              <Text className="mt-1.5 text-sm font-medium text-gray-500">
                West Bengal (for GST purposes)
              </Text>
            </View>

            <View className="mt-4 rounded-[22px] bg-white p-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-[#fff4cf]">
                    <Ionicons
                      name="pricetag-outline"
                      size={18}
                      color="#eab308"
                    />
                  </View>
                  <Text className="text-base font-bold text-gray-900">
                    Apply offers
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#6b7280" />
              </View>
            </View>

            <View className="mt-4 rounded-[22px] bg-white p-4 shadow-sm">
              <Text className="text-sm font-medium leading-6 text-gray-600">
                By proceeding, you agree to complete this transaction and
                confirm your selected booking slot.
              </Text>
            </View>
          </ScrollView>

          <View className="absolute inset-x-0 bottom-0 border-t border-gray-100 bg-white px-4 pb-6 pt-3">
            <View className="flex-row items-center gap-4">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-500">
                  Total
                </Text>
                <Text className="mt-0.5 text-2xl font-bold text-gray-900">
                  {formatCurrency(orderTotal)}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  router.push(
                    `/payment?turfId=${turf.id}&date=${encodeURIComponent(
                      date ?? '',
                    )}&slots=${encodeURIComponent(
                      selectedSlots.join('|'),
                    )}&hours=${hoursCount}&amount=${orderTotal}`,
                  )
                }
                className="min-w-[170px] rounded-[18px] bg-[#cf4452] px-6 py-4 items-center"
              >
                <Text className="text-base font-bold text-white">Continue</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
