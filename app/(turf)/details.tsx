import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Turf } from '@/data/turf';
import { useTurfById } from '@/hooks/useTurf';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

function AmenityPill({ amenity }: { amenity: Turf['amenities'][number] }) {
  return (
    <View className="flex-row items-center gap-2 rounded-xl bg-gray-100 border border-gray-200 px-3 py-2">
      <View className="h-8 w-8 items-center justify-center rounded-xl bg-white border border-gray-200">
        <Ionicons
          name={amenity.icon as unknown as IoniconName}
          size={18}
          color="#16a34a"
        />
      </View>
      <Text className="text-xs font-bold text-gray-800" numberOfLines={1}>
        {amenity.label}
      </Text>
    </View>
  );
}

export default function TurfDetail() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { data, isLoading } = useTurfById(id);
  const turf = data;

  const amenities = useMemo(() => turf?.amenities ?? [], [turf]);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['bottom', 'left', 'right']}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: turf?.name ?? 'Turf Details',
          headerBackTitle: 'Back',
        }}
      />
      {isLoading || !turf ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-gray-500">Loading turf...</Text>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView contentContainerClassName="pb-4">
            <View className="relative">
              <Image
                source={{ uri: turf.image }}
                resizeMode="cover"
                className="h-72 w-full"
              />
            </View>

            <View className="px-4 pt-4">
              <View className="flex-row items-start justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-gray-900">
                    {turf.name}
                  </Text>
                  <View className="mt-2 flex-row items-center gap-2">
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="star" size={16} color="#eab308" />
                      <Text className="text-yellow-500 font-bold">
                        {turf.rating.toFixed(1)}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-400">•</Text>
                    <Text className="text-sm font-semibold text-gray-600">
                      {turf.location}
                    </Text>
                  </View>
                </View>

                <View className="rounded-xl bg-green-50 px-3 py-2 items-end">
                  <Text className="text-xs font-bold text-green-800">
                    Price
                  </Text>
                  <Text className="mt-1 text-lg font-bold text-green-700">
                    ₹{turf.price}/hr
                  </Text>
                </View>
              </View>

              <View className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                <Text className="text-sm font-bold text-gray-900">Address</Text>
                <View className="mt-2 flex-row items-start gap-2">
                  <Ionicons name="location-outline" size={18} color="#16a34a" />
                  <Text className="text-sm font-semibold text-gray-700">
                    {turf.address}
                  </Text>
                </View>
              </View>

              <View className="mt-4">
                <Text className="text-sm font-bold text-gray-900 ml-1">
                  Amenities
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-2 mt-3"
                >
                  {amenities.map((a) => (
                    <AmenityPill key={a.label} amenity={a} />
                  ))}
                </ScrollView>
              </View>

              <View className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                <Text className="text-sm font-bold text-gray-900">Sports</Text>
                <Text className="mt-1 text-sm font-semibold text-gray-600">
                  {turf.sports.join(' & ')} • {turf.timeSlots.join(', ')}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View className="border-t border-gray-200 px-4 py-4 bg-white">
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                // UI-only: booking flow is not implemented yet.
              }}
              className="rounded-full bg-[#16a34a] px-4 py-4 items-center shadow-sm"
            >
              <Text className="text-base font-bold text-white">Book Now</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
