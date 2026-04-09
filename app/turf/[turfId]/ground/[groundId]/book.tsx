import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { useBookSlotMutation } from '@/src/hooks/use-auth';
import { type AvailableSlot } from '@/src/lib/api';

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
    <SafeAreaView className="flex-1 bg-slate-50" edges={['left', 'right', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-5 pb-28 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4 rounded-[28px] border border-slate-200 bg-white p-5">
          <View className="gap-1.5">
            <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-400">
              Turf
            </Text>
            <Text className="text-xl font-bold text-slate-900">
              {typeof params.turfName === 'string' ? params.turfName : 'Turf'}
            </Text>
          </View>

          <View className="gap-1.5">
            <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-400">
              Ground
            </Text>
            <Text className="text-xl font-bold text-slate-900">
              {typeof params.groundName === 'string'
                ? params.groundName
                : 'Ground'}
            </Text>
          </View>

          <View className="gap-1.5">
            <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-400">
              Slots
            </Text>
            <Text className="text-base font-semibold text-slate-900">
              {selectedSlots.length} selected
            </Text>
          </View>

          <View className="gap-3">
            {selectedSlots.map((slot) => (
              <View
                className="rounded-2xl bg-slate-50 px-4 py-3"
                key={slot.slot_id}
              >
                <Text className="text-sm font-semibold text-slate-900">
                  {formatDateLabel(slot.date)}
                </Text>
                <Text className="mt-1 text-sm text-slate-600">
                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                </Text>
                <Text className="mt-2 text-sm font-semibold text-slate-900">
                  ₹ {slot.price}
                </Text>
              </View>
            ))}
          </View>

          <View className="rounded-2xl bg-teal-50 px-4 py-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-teal-700">
              Total amount
            </Text>
            <Text className="mt-1 text-2xl font-bold text-teal-800">
              ₹ {totalAmount}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-slate-200 bg-white px-5 pb-6 pt-4">
        <Button
          loading={bookSlotMutation.isPending}
          onPress={handleConfirm}
          title="Confirm"
        />
      </View>
    </SafeAreaView>
  );
}
