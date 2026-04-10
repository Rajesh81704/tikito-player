import { router } from 'expo-router';
import { useState, useMemo } from 'react';
import { FlatList, Text, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { TurfFieldCard } from '@/src/components/TurfFieldCard';
import { useTurfsQuery } from '@/src/hooks/use-auth';

export default function DiscoverScreen() {
  const turfsQuery = useTurfsQuery('', true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTurfs = useMemo(() => {
    if (!turfsQuery.data) return [];
    const query = searchQuery.toLowerCase();
    return turfsQuery.data.filter(
      (turf) =>
        turf.turf_name.toLowerCase().includes(query) ||
        (turf.turf_location &&
          turf.turf_location.toLowerCase().includes(query)),
    );
  }, [searchQuery, turfsQuery.data]);

  if (turfsQuery.isLoading) {
    return <FullScreenLoader label="Finding the best turfs..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
      {/* Search Header */}
      <View className="p-4">
        <View className="flex-row items-center h-14 px-4 rounded-2xl bg-slate-100 border border-slate-200">
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            placeholder="Search by name or city..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-3 text-base text-slate-900"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
        </View>
      </View>

      {turfsQuery.isError ? (
        <View className="mx-4 rounded-3xl bg-rose-50 p-6">
          <Text className="text-base font-bold text-rose-700">
            Error loading turfs.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTurfs}
          keyExtractor={(item) => item.turf_field_id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          // Parent Padding (16px)
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          // Horizontal Gap (16px)
          columnWrapperStyle={{ gap: 16 }}
          // Vertical Gap (16px)
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => (
            <TurfFieldCard
              turf={item}
              onPress={() => {
                router.push({
                  pathname: '/turf/[turfId]',
                  params: {
                    turfId: item.turf_field_id,
                    turf: JSON.stringify(item),
                  },
                });
              }}
            />
          )}
          ListEmptyComponent={
            <View className="mt-20 items-center justify-center">
              <Text className="text-lg font-black text-slate-900">
                No turfs found
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
