import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { useAvailableSlotsQuery } from '@/src/hooks/use-auth';
import { type AvailableSlot } from '@/src/lib/api';

function formatTime(value: string) {
  return value.slice(0, 5);
}

function formatDateLabel(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

function formatDayLabel(dayOfWeek: string) {
  return dayOfWeek.slice(0, 3).toUpperCase();
}

function formatDateNumber(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
  });
}

function formatMonthLabel(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate
    .toLocaleDateString('en-IN', {
      month: 'short',
    })
    .toUpperCase();
}

export default function GroundSlotsScreen() {
  const params = useLocalSearchParams<{
    groundId?: string;
    groundName?: string;
    turfName?: string;
  }>();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const slotsQuery = useAvailableSlotsQuery(
    typeof params.groundId === 'string' ? params.groundId : undefined,
    true,
  );

  const groupedSlots = useMemo(() => {
    const groups = new Map<string, AvailableSlot[]>();

    for (const slot of slotsQuery.data ?? []) {
      const existing = groups.get(slot.date) ?? [];
      existing.push(slot);
      groups.set(slot.date, existing);
    }

    return Array.from(groups.entries()).map(([date, slots]) => ({
      date,
      dayOfWeek: slots[0]?.day_of_week ?? '',
      slots,
    }));
  }, [slotsQuery.data]);

  const activeDate = selectedDate ?? groupedSlots[0]?.date ?? null;
  const activeSlots =
    groupedSlots.find((group) => group.date === activeDate)?.slots ?? [];

  if (slotsQuery.isLoading) {
    return <FullScreenLoader label="Loading slots..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-5 py-5"
        showsVerticalScrollIndicator={false}
      >
        {slotsQuery.isError ? (
          <View className="rounded-3xl bg-rose-50 px-5 py-6">
            <Text className="text-base font-semibold text-rose-700">
              {slotsQuery.error instanceof Error
                ? slotsQuery.error.message
                : 'Could not load available slots.'}
            </Text>
          </View>
        ) : groupedSlots.length ? (
          <View className="gap-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="pr-5"
            >
              {groupedSlots.map((group) => {
                const isActive = activeDate === group.date;

                return (
                  <Pressable
                    className={`mr-3 h-[94px] w-[72px] items-center justify-center rounded-[20px] border ${
                      isActive
                        ? 'border-teal-700 bg-teal-700'
                        : 'border-slate-200 bg-white'
                    }`}
                    key={group.date}
                    onPress={() => setSelectedDate(group.date)}
                  >
                    <Text
                      className={`text-xs font-medium tracking-[1px] ${
                        isActive ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {formatDayLabel(group.dayOfWeek)}
                    </Text>
                    <Text
                      className={`mt-3 text-2xl font-bold ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {formatDateNumber(group.date)}
                    </Text>
                    <Text
                      className={`mt-2 text-xs tracking-[1px] ${
                        isActive ? 'text-white/90' : 'text-slate-400'
                      }`}
                    >
                      {formatMonthLabel(group.date)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {activeSlots.map((slot) => (
              <View
                className="gap-3 rounded-3xl border border-slate-200 bg-white p-4"
                key={slot.slot_id}
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="gap-1">
                    <Text className="text-lg font-bold text-slate-900">
                      {formatTime(slot.start_time)} -{' '}
                      {formatTime(slot.end_time)}
                    </Text>
                  </View>

                  {slot.is_peak ? (
                    <View className="rounded-full bg-amber-50 px-3 py-1.5">
                      <Text className="text-xs font-semibold uppercase tracking-[0.5px] text-amber-700">
                        Peak
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text className="text-base font-semibold text-slate-900">
                  ₹ {slot.price}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="rounded-3xl border border-slate-200 bg-white px-5 py-6">
            <Text className="text-base font-semibold text-slate-900">
              No slots available for this ground.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
