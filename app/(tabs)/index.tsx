import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { TurfCard } from '@/components/ui/TurfCard';
import { useTurfList } from '@/hooks/useTurf';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useTurfList();
  const turfs = data ?? [];

  const popular = useMemo(() => turfs.slice(0, 6), [turfs]);
  const recommended = useMemo(() => {
    const nearby = turfs.filter((t) => t.isNearby);
    const base = (nearby.length ? nearby : turfs).slice();
    return base.sort((a, b) => b.rating - a.rating).slice(0, 4);
  }, [turfs]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="px-4 pb-28 pt-2">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">Hey, Amit</Text>
            <View className="mt-2 flex-row items-center gap-2">
              <Ionicons name="pin" size={16} color="#16a34a" />
              <Text className="text-sm font-semibold text-gray-600">
                Indiranagar
              </Text>
            </View>
          </View>

          <View className="rounded-xl bg-gray-100 p-3">
            <Ionicons name="notifications-outline" size={20} color="#16a34a" />
          </View>
        </View>

        {/* Banner */}
        <Pressable
          onPress={() => router.push('/discover')}
          className="mt-4 overflow-hidden rounded-3xl shadow-sm"
        >
          <ImageBackground
            source={require('@/assets/images/hero.png')}
            className="p-6 justify-end items-center aspect-square w-full"
            resizeMode="cover"
          >
            {/* Dark overlay reduces image opacity so text stays readable */}
            <View className="absolute inset-0 bg-black/10" />

            <View className="relative z-10 w-full items-center">
              <Text className="text-[1.75rem] font-bold text-white text-center mb-2">
                Book Venues With The Best Offers!
              </Text>
              <Text className="text-base font-semibold text-white/90 text-center mb-5">
                Discover top turfs near you and book in seconds.
              </Text>

              <Pressable
                onPress={() => router.push('/discover')}
                className="w-full items-center justify-center rounded-full bg-white px-4 py-3.5"
              >
                <Text className="text-base font-bold text-green-700">
                  Book Now
                </Text>
              </Pressable>
            </View>
          </ImageBackground>
        </Pressable>

        {/* Quick Actions */}
        <View className="mt-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Quick Actions
          </Text>

          <View className="flex-row flex-wrap justify-between gap-y-3">
            {[
              {
                title: 'My Bookings',
                icon: 'calendar-outline',
                iconBg: 'bg-gray-100',
                iconColor: '#6b7280',
              },
              {
                title: 'Quick Book',
                icon: 'flash-outline',
                iconBg: 'bg-green-50',
                iconColor: '#16a34a',
              },
              {
                title: 'Favorites',
                icon: 'heart-outline',
                iconBg: 'bg-green-50',
                iconColor: '#16a34a',
              },
              {
                title: 'Offers',
                icon: 'pricetags-outline',
                iconBg: 'bg-emerald-50',
                iconColor: '#059669',
              },
            ].map((action) => (
              <Pressable
                key={action.title}
                onPress={() => {
                  if (action.title === 'Favorites') router.push('/favorites');
                  else router.push('/discover');
                }}
                accessibilityRole="button"
                accessibilityLabel={action.title}
                className="w-[48%] rounded-2xl bg-white border border-gray-100 shadow-none px-4 py-4"
              >
                <View className="items-center">
                  <View
                    className={`h-12 w-12 rounded-2xl border items-center justify-center ${action.iconBg} border-gray-100`}
                  >
                    <Ionicons
                      name={action.icon as unknown as IoniconName}
                      size={22}
                      color={action.iconColor}
                    />
                  </View>
                  <Text
                    className="mt-2 text-center text-sm font-extrabold"
                    numberOfLines={1}
                    style={{ color: action.iconColor }}
                  >
                    {action.title}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recommend */}
        <View className="mt-5">
          <SectionHeader
            title="Recommend for you"
            actionText={isLoading ? undefined : 'See all'}
            onActionPress={() => router.push('/discover')}
          />

          {isLoading ? (
            <Text className="text-sm text-gray-500">Loading...</Text>
          ) : (
            <FlatList
              horizontal
              data={recommended}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3"
              renderItem={({ item }) => (
                <View className="w-44">
                  <TurfCard
                    turf={item}
                    size="compact"
                    onPress={() => router.push(`/details?id=${item.id}`)}
                  />
                </View>
              )}
              ListEmptyComponent={
                <Text className="mt-2 text-sm text-gray-500">
                  No recommendations right now.
                </Text>
              }
            />
          )}
        </View>

        {/* Popular */}
        <View className="mt-5">
          <SectionHeader
            title="Popular Turfs"
            actionText={isLoading ? undefined : 'See all'}
            onActionPress={() => router.push('/discover')}
          />

          {isLoading ? (
            <Text className="text-sm text-gray-500">Loading...</Text>
          ) : (
            <FlatList
              horizontal
              data={popular}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3"
              renderItem={({ item }) => (
                <View className="w-44">
                  <TurfCard
                    turf={item}
                    size="compact"
                    onPress={() => router.push(`/details?id=${item.id}`)}
                  />
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
