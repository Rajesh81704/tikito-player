import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { useBookSlotMutation } from '@/src/hooks/use-auth';
import type { AvailableSlot } from '@/src/lib/api';

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
  const params = useLocalSearchParams<{
    turfId?: string;
    groundId?: string;
    turfName?: string;
    groundName?: string;
    slots?: string;
  }>();
  const bookSlotMutation = useBookSlotMutation();

  const selectedSlots =
    typeof params.slots === 'string'
      ? (JSON.parse(params.slots) as AvailableSlot[])
      : [];

  const totalAmount = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);

  if (!selectedSlots.length) {
    return <FullScreenLoader label="Loading booking details..." />;
  }

  const handleConfirm = async () => {
    try {
      await Promise.all(
        selectedSlots.map((slot) =>
          bookSlotMutation.mutateAsync({
            slot_id: slot.slot_id,
          }),
        ),
      );

      router.replace({
        pathname: '/turf/[turfId]/ground/[groundId]/success',
        params: {
          turfId: typeof params.turfId === 'string' ? params.turfId : '',
          groundId: typeof params.groundId === 'string' ? params.groundId : '',
          turfName: typeof params.turfName === 'string' ? params.turfName : '',
          groundName:
            typeof params.groundName === 'string' ? params.groundName : '',
        },
      });
    } catch (error) {
      Alert.alert(
        'Booking failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['left', 'right', 'bottom']}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-5 pb-28 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1 px-1">
          <Text className="text-[26px] font-black tracking-tight text-emerald-600">
            Confirm Booking
          </Text>
          <Text className="text-sm font-medium text-slate-500">
            Review your selected slots before you continue.
          </Text>
        </View>

        <View className="gap-4 rounded-2xl border border-slate-200 bg-white p-4">
          <View className="flex-row flex-wrap gap-3">
            <View className="min-w-[140px] flex-1 rounded-2xl bg-slate-50 px-4 py-3">
              <Text className="text-[11px] font-bold uppercase tracking-[0.7px] text-slate-400">
                Turf
              </Text>
              <Text className="mt-1 text-base font-black text-slate-900">
                {typeof params.turfName === 'string' ? params.turfName : 'Turf'}
              </Text>
            </View>

            <View className="min-w-[140px] flex-1 rounded-2xl bg-slate-50 px-4 py-3">
              <Text className="text-[11px] font-bold uppercase tracking-[0.7px] text-slate-400">
                Ground
              </Text>
              <Text className="mt-1 text-base font-black text-slate-900">
                {typeof params.groundName === 'string'
                  ? params.groundName
                  : 'Ground'}
              </Text>
            </View>
          </View>

          <View className="rounded-2xl bg-emerald-50 px-4 py-4">
            <Text className="text-[11px] font-bold uppercase tracking-[0.7px] text-emerald-700">
              Total amount
            </Text>
            <View className="mt-2 flex-row items-end justify-between">
              <Text className="text-[28px] font-black tracking-tight text-emerald-600">
                ₹ {totalAmount}
              </Text>
              <Text className="text-sm font-semibold text-emerald-700">
                {selectedSlots.length} slot
                {selectedSlots.length === 1 ? '' : 's'}
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-3">
          <Text className="px-1 text-sm font-semibold text-slate-500">
            Selected slots
          </Text>

          {selectedSlots.map((slot) => (
            <View
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              key={slot.slot_id}
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-900">
                    {formatDateLabel(slot.date)}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-slate-600">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </Text>
                </View>
                <View className="rounded-xl bg-slate-50 px-3 py-2">
                  <Text className="text-sm font-black text-slate-900">
                    ₹ {slot.price}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="border-t border-slate-200 bg-white px-5 pb-6 pt-4">
        <Pressable
          accessibilityRole="button"
          className={`min-h-[56px] flex-row items-center justify-between rounded-2xl px-5 ${
            bookSlotMutation.isPending ? 'bg-slate-300' : 'bg-emerald-600'
          }`}
          disabled={bookSlotMutation.isPending}
          onPress={handleConfirm}
          style={({ pressed }) => ({
            transform: [
              { scale: pressed && !bookSlotMutation.isPending ? 0.99 : 1 },
            ],
            opacity: bookSlotMutation.isPending ? 1 : pressed ? 0.96 : 1,
          })}
        >
          <View>
            <Text
              className={`text-base font-black tracking-tight ${
                bookSlotMutation.isPending ? 'text-slate-500' : 'text-white'
              }`}
            >
              {bookSlotMutation.isPending ? 'Confirming...' : 'Confirm'}
            </Text>
            <Text
              className={`text-xs font-semibold ${
                bookSlotMutation.isPending
                  ? 'text-slate-500'
                  : 'text-emerald-50'
              }`}
            >
              {selectedSlots.length} slot
              {selectedSlots.length === 1 ? '' : 's'} ready to book
            </Text>
          </View>

          <View
            className={`h-9 w-9 items-center justify-center rounded-full ${
              bookSlotMutation.isPending ? 'bg-slate-200' : 'bg-white/20'
            }`}
          >
            <Text
              className={`text-lg font-black ${
                bookSlotMutation.isPending ? 'text-slate-500' : 'text-white'
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
