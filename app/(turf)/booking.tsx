import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTurfById } from '@/hooks/useTurf';

type BookingSlot = {
  id: string;
  label: string;
  status: 'available' | 'booked' | 'blocked';
  startHour: number;
  endHour: number;
};

type BookingDate = {
  id: string;
  dayName: string;
  dayNumber: string;
  month: string;
  fullLabel: string;
};

const SLOT_STATUSES: BookingSlot['status'][] = [
  'available',
  'available',
  'available',
  'available',
  'booked',
  'booked',
  'available',
  'available',
  'available',
  'blocked',
  'available',
  'available',
];

function formatHour(hour: number) {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalized = hour % 12 || 12;
  return `${normalized} ${suffix}`;
}

function buildDateOptions() {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return {
      id: date.toISOString(),
      dayName: date
        .toLocaleDateString('en-US', { weekday: 'short' })
        .toUpperCase(),
      dayNumber: date.toLocaleDateString('en-US', { day: '2-digit' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      fullLabel: date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    } satisfies BookingDate;
  });
}

function buildSlots() {
  return Array.from({ length: 12 }, (_, index) => {
    const startHour = 10 + index;
    return {
      id: `slot-${startHour}`,
      label: `${formatHour(startHour)} - ${formatHour(startHour + 1)}`,
      status: SLOT_STATUSES[index],
      startHour,
      endHour: startHour + 1,
    } satisfies BookingSlot;
  });
}

function getSlotStyles(status: BookingSlot['status']) {
  switch (status) {
    case 'available':
      return {
        container: 'border-l-[2px] border-green-500',
        statusText: 'text-green-700',
        statusDot: 'bg-green-600',
        statusLabel: 'Available',
      };
    case 'blocked':
      return {
        container: 'border-l-[2px] border-amber-500',
        statusText: 'text-amber-700',
        statusDot: 'bg-amber-500',
        statusLabel: 'Blocked',
      };
    default:
      return {
        container: 'border-l-[2px] border-rose-500',
        statusText: 'text-rose-700',
        statusDot: 'bg-rose-600',
        statusLabel: 'Booked',
      };
  }
}

export default function BookingScreen() {
  const router = useRouter();
  const { turfId } = useLocalSearchParams<{ turfId?: string }>();
  const { data: turf, isLoading } = useTurfById(turfId);

  const dates = useMemo(() => buildDateOptions(), []);
  const slots = useMemo(() => buildSlots(), []);
  const [selectedDateId, setSelectedDateId] = useState(dates[0]?.id ?? '');
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);

  const selectedDate =
    dates.find((date) => date.id === selectedDateId) ?? dates[0];
  const selectedSlots = slots.filter((slot) =>
    selectedSlotIds.includes(slot.id),
  );
  const selectedCount = selectedSlots.length;
  const selectedSummary =
    selectedCount > 0
      ? `${formatHour(selectedSlots[0].startHour)} - ${formatHour(
          selectedSlots[selectedSlots.length - 1].endHour,
        )}`
      : null;

  function handleDateSelect(dateId: string) {
    setSelectedDateId(dateId);
    setSelectedSlotIds([]);
  }

  function handleSlotPress(slot: BookingSlot) {
    if (slot.status !== 'available') return;

    const selectedIndices = selectedSlotIds
      .map((id) => slots.findIndex((item) => item.id === id))
      .filter((index) => index >= 0)
      .sort((a, b) => a - b);
    const currentIndex = slots.findIndex((item) => item.id === slot.id);
    const isSelected = selectedSlotIds.includes(slot.id);

    if (selectedIndices.length === 0) {
      setSelectedSlotIds([slot.id]);
      return;
    }

    if (isSelected) {
      if (
        currentIndex === selectedIndices[0] ||
        currentIndex === selectedIndices[selectedIndices.length - 1]
      ) {
        setSelectedSlotIds(selectedSlotIds.filter((id) => id !== slot.id));
      }
      return;
    }

    const minIndex = selectedIndices[0];
    const maxIndex = selectedIndices[selectedIndices.length - 1];

    if (currentIndex === minIndex - 1 || currentIndex === maxIndex + 1) {
      setSelectedSlotIds(
        [...selectedSlotIds, slot.id].sort((left, right) => {
          const leftIndex = slots.findIndex((item) => item.id === left);
          const rightIndex = slots.findIndex((item) => item.id === right);
          return leftIndex - rightIndex;
        }),
      );
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
        >
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </Pressable>

        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900">
            {turf?.name ?? 'Choose a slot'}
          </Text>
          <Text className="mt-0.5 text-sm font-medium text-gray-500">
            Pick a date and an available time.
          </Text>
        </View>
      </View>

      {isLoading || !turf ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-gray-500">Loading booking options...</Text>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-4 pt-3 pb-8"
          >
            {dates.map((date) => {
              const isSelected = date.id === selectedDate?.id;

              return (
                <Pressable
                  key={date.id}
                  onPress={() => handleDateSelect(date.id)}
                  className={`h-24 w-[4.3rem] items-center justify-center rounded-[18px] border px-2 ${
                    isSelected
                      ? 'border-[#ef4444] bg-[#ef4444]'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold tracking-wide ${
                      isSelected ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {date.dayName}
                  </Text>
                  <Text
                    className={`mt-1 text-xl font-bold ${
                      isSelected ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {date.dayNumber}
                  </Text>
                  <Text
                    className={`mt-1 text-xs font-semibold tracking-wide ${
                      isSelected ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {date.month}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView contentContainerClassName="px-4 pb-28">
            <View className="rounded-[24px] bg-white p-4 shadow-sm">
              <Text className="text-base font-bold text-gray-900">
                Available slots for {selectedDate?.fullLabel}
              </Text>
              <Text className="mt-1 text-xs font-medium text-gray-500">
                {turf.location} • ₹{turf.price}/hour
              </Text>
              <Text className="mt-1 text-xs font-medium text-gray-400">
                Select one or more consecutive available slots.
              </Text>

              <View className="mt-4 flex-row flex-wrap justify-between gap-y-2.5">
                {slots.map((slot) => {
                  const isAvailable = slot.status === 'available';
                  const styles = getSlotStyles(slot.status);
                  const isSelected = selectedSlotIds.includes(slot.id);

                  return (
                    <Pressable
                      key={slot.label}
                      onPress={() => handleSlotPress(slot)}
                      disabled={!isAvailable}
                      className={`w-[48.5%] rounded-sm px-3 py-3 ${
                        isSelected
                          ? 'bg-green-600'
                          : `bg-white ${styles.container}`
                      }`}
                    >
                      <View className="gap-1.5">
                        <Text
                          className={`text-sm font-bold ${
                            isSelected ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {slot.label}
                        </Text>
                        <View className="flex-row items-center gap-1.5">
                          <View
                            className={`h-2 w-2 rounded-full ${
                              isSelected ? 'bg-white' : styles.statusDot
                            }`}
                          />
                          <Text
                            className={`text-[11px] font-semibold ${
                              isSelected ? 'text-white' : styles.statusText
                            }`}
                          >
                            {isSelected ? 'Selected' : styles.statusLabel}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View className="absolute inset-x-0 bottom-0 border-t border-gray-100 bg-white px-4 pb-6 pt-3">
            <View className="flex-row items-center gap-4">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-500">
                  {selectedCount > 0
                    ? `${selectedCount} slot${selectedCount > 1 ? 's' : ''}`
                    : 'No slots selected'}
                </Text>
                <Text className="mt-0.5 text-base font-bold text-gray-900">
                  {selectedSummary ?? 'Choose slots'}
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  if (!selectedDate || selectedSlots.length === 0) return;

                  router.push(
                    `/confirm-booking?turfId=${turf.id}&date=${encodeURIComponent(
                      selectedDate.fullLabel,
                    )}&slots=${encodeURIComponent(
                      selectedSlots.map((slot) => slot.label).join('|'),
                    )}&hours=${selectedSlots.length}`,
                  );
                }}
                disabled={selectedSlots.length === 0}
                className={`min-w-[170px] rounded-[18px] px-6 py-4 items-center ${
                  selectedSlots.length === 0 ? 'bg-gray-300' : 'bg-[#16a34a]'
                }`}
              >
                <Text className="text-base font-bold text-white">Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
