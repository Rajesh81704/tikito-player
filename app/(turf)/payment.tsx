import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTurfById } from '@/hooks/useTurf';

function formatCurrency(value: number) {
  return `₹${value.toFixed(2)}`;
}

export default function PaymentScreen() {
  const router = useRouter();
  const { turfId, date, slots, hours, amount } = useLocalSearchParams<{
    turfId?: string;
    date?: string;
    slots?: string;
    hours?: string;
    amount?: string;
  }>();

  const { data: turf, isLoading } = useTurfById(turfId);
  const payableAmount = Number(amount ?? 0);
  const selectedSlots = (slots ?? '').split('|').filter(Boolean);
  const hoursCount = Number(hours ?? (selectedSlots.length || 0));
  const slotSummary =
    selectedSlots.length > 1
      ? `${selectedSlots[0].split(' - ')[0]} - ${
          selectedSlots[selectedSlots.length - 1].split(' - ')[1]
        }`
      : (selectedSlots[0] ?? '');

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
        <View>
          <Text className="text-xl font-bold text-gray-900">Payment</Text>
          <Text className="text-xs font-medium text-gray-500">
            Complete your booking securely.
          </Text>
        </View>
      </View>

      {isLoading || !turf ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-gray-500">Loading payment details...</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerClassName="px-4 pt-3 pb-32">
            <View className="rounded-[22px] bg-[#123524] p-4 shadow-sm">
              <Text className="text-xs font-bold uppercase tracking-[1.5px] text-green-200">
                Booking summary
              </Text>
              <Text className="mt-2 text-2xl font-bold text-white">
                {turf.name}
              </Text>
              <Text className="mt-1.5 text-sm font-medium text-green-100">
                {date}
              </Text>
              <Text className="mt-0.5 text-sm font-medium text-green-100">
                {slotSummary}
              </Text>
              <Text className="mt-0.5 text-xs font-medium text-green-200">
                {hoursCount} hour{hoursCount > 1 ? 's' : ''} selected
              </Text>
              <View className="mt-4 flex-row items-center justify-between rounded-[20px] bg-white/10 px-3.5 py-3">
                <Text className="text-sm font-semibold text-white">
                  Amount to pay
                </Text>
                <Text className="text-2xl font-bold text-white">
                  {formatCurrency(payableAmount)}
                </Text>
              </View>
            </View>

            <View className="mt-4 rounded-[22px] bg-white p-4 shadow-sm">
              <Text className="text-base font-bold text-gray-900">
                Choose payment method
              </Text>

              {[
                {
                  title: 'UPI',
                  subtitle: 'Pay using any UPI app',
                  icon: 'phone-portrait-outline' as const,
                },
                {
                  title: 'Credit / Debit Card',
                  subtitle: 'Visa, Mastercard, RuPay',
                  icon: 'card-outline' as const,
                },
                {
                  title: 'Net Banking',
                  subtitle: 'All major banks supported',
                  icon: 'business-outline' as const,
                },
              ].map((method, index) => (
                <Pressable
                  key={method.title}
                  className={`mt-3 flex-row items-center justify-between rounded-[20px] border px-3.5 py-3 ${
                    index === 0
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className={`h-10 w-10 items-center justify-center rounded-xl ${
                        index === 0 ? 'bg-green-600' : 'bg-gray-100'
                      }`}
                    >
                      <Ionicons
                        name={method.icon}
                        size={18}
                        color={index === 0 ? '#ffffff' : '#111827'}
                      />
                    </View>
                    <View>
                      <Text className="text-base font-bold text-gray-900">
                        {method.title}
                      </Text>
                      <Text className="mt-0.5 text-xs font-medium text-gray-500">
                        {method.subtitle}
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name={index === 0 ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={index === 0 ? '#16a34a' : '#9ca3af'}
                  />
                </Pressable>
              ))}
            </View>

            <View className="mt-4 rounded-[22px] bg-white p-4 shadow-sm">
              <Text className="text-sm font-medium leading-6 text-gray-600">
                Payments on this screen are UI-only for now. You can connect
                your payment gateway next.
              </Text>
            </View>
          </ScrollView>

          <View className="absolute inset-x-0 bottom-0 border-t border-gray-100 bg-white px-4 pb-6 pt-3">
            <Pressable className="rounded-[18px] bg-[#16a34a] px-6 py-4 items-center">
              <Text className="text-base font-bold text-white">
                Pay {formatCurrency(payableAmount)}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
