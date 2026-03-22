import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/ui/Chip';
import { TurfCard } from '@/components/ui/TurfCard';
import type { Turf } from '@/data/turf';
import { useTurfList } from '@/hooks/useTurf';

const FILTERS = ['Football', 'Cricket', 'Turf', 'Evening', 'Nearby'] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(turf: Turf, filter: Filter) {
  switch (filter) {
    case 'Football':
      return turf.sports.includes('Football');
    case 'Cricket':
      return turf.sports.includes('Cricket');
    case 'Turf':
      return true;
    case 'Evening':
      return turf.timeSlots.includes('Evening');
    case 'Nearby':
      return turf.isNearby;
    default:
      return true;
  }
}

export default function Discover() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>('Turf');
  const [query, setQuery] = useState('');

  const { data, isLoading } = useTurfList();

  const turfs = data ?? [];

  const filtered = useMemo(() => {
    const base = turfs.filter((t) => matchesFilter(t, activeFilter));
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((t) => {
      return (
        t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q)
      );
    });
  }, [activeFilter, query, turfs]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerClassName="px-4 pb-28 pt-2"
        columnWrapperStyle={{ justifyContent: 'space-between', gap: 12 }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListHeaderComponent={
          <View className="mb-4 gap-3">
            <View className="gap-1">
              <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Discover
              </Text>
              <Text className="text-sm font-semibold text-gray-500">
                Find the perfect turf for your next game.
              </Text>
            </View>

            {/* Search */}
            <View className="flex-row items-center gap-3 rounded-2xl bg-[#E3E3E8] px-4 h-11">
              <Ionicons name="search" size={18} color="#8E8E93" />

              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by venue or area"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base font-semibold text-gray-900"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                keyboardType="default"
                selectTextOnFocus
                accessibilityLabel="Search turfs"
                multiline={false}
                numberOfLines={1}
                style={{
                  textAlignVertical: 'center',
                  height: '100%',
                  paddingTop: 0,
                  paddingBottom: 0,
                  margin: 0,
                  lineHeight: 18,
                  fontSize: 16,
                  // Android-specific: removes extra top/bottom font padding.
                  includeFontPadding: false,
                }}
              />

              {query ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  onPress={() => setQuery('')}
                  hitSlop={10}
                >
                  <Ionicons name="close" size={20} color="#9ca3af" />
                </Pressable>
              ) : null}
            </View>

            {/* Filters */}
            <View className="gap-2">
              <Text className="text-sm font-extrabold text-gray-900">
                Filters
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2"
              >
                {FILTERS.map((item) => (
                  <Chip
                    key={item}
                    selected={item === activeFilter}
                    onPress={() => setActiveFilter(item)}
                  >
                    {item}
                  </Chip>
                ))}
              </ScrollView>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex-1">
            <TurfCard
              turf={item}
              size="compact"
              onPress={() => router.push(`/details?id=${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          isLoading ? (
            <View className="mt-6">
              <Text className="text-gray-500">Loading turfs...</Text>
            </View>
          ) : (
            <View className="mt-6">
              <Text className="text-base font-bold text-gray-900">
                No matches
              </Text>
              <Text className="mt-1 text-sm text-gray-500">
                Try a different filter or search keyword.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
