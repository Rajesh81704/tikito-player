import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TurfCard } from '@/components/ui/TurfCard';
import type { Turf } from '@/data/turf';
import { useTurfList } from '@/hooks/useTurf';

export default function Favorites() {
  const router = useRouter();
  const { data, isLoading } = useTurfList();
  const [favoriteIds] = useState<string[]>(['turf-1', 'turf-3']);

  const turfs = data ?? [];

  const favoriteTurfs = useMemo(() => {
    const set = new Set(favoriteIds);
    return turfs.filter((t) => set.has(t.id));
  }, [favoriteIds, turfs]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-4 pb-4 bg-white border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900 tracking-tight">
          Favorites
        </Text>
        <Text className="mt-1 text-sm text-gray-500">
          Your saved turfs for quick booking.
        </Text>
      </View>

      {isLoading ? (
        <View className="px-4 pt-6">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      ) : favoriteTurfs.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="rounded-2xl bg-white p-5 shadow-sm">
            <Ionicons name="heart-outline" size={34} color="#16a34a" />
            <Text className="mt-3 text-base font-bold text-gray-900 text-center">
              No favorites yet
            </Text>
            <Text className="mt-1 text-sm text-gray-500 text-center">
              Browse Discover and tap a turf to save it here.
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/discover')}
            className="mt-5 w-full rounded-2xl bg-green-500 px-4 py-3 items-center"
          >
            <Text className="text-sm font-bold text-white">Explore Turfs</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favoriteTurfs as Turf[]}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-28 pt-4"
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 12 }}
          renderItem={({ item }) => (
            <View className="flex-1">
              <TurfCard
                turf={item}
                size="compact"
                onPress={() => router.push(`/details?id=${item.id}`)}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
