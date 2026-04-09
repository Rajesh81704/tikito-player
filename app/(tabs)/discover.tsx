import { ScrollView, Text, View } from 'react-native';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { TurfCard } from '@/src/components/TurfCard';
import { useTurfsQuery } from '@/src/hooks/use-auth';

export default function DiscoverScreen() {
  const turfsQuery = useTurfsQuery('', true);

  if (turfsQuery.isLoading) {
    return <FullScreenLoader label="Loading all turfs..." />;
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-5 px-5 py-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-2">
        <Text className="text-3xl font-bold text-slate-900">Discover</Text>
        <Text className="text-base leading-6 text-slate-600">
          Browse all available turfs across cities.
        </Text>
      </View>

      {turfsQuery.isError ? (
        <View className="rounded-3xl bg-rose-50 px-5 py-6">
          <Text className="text-base font-semibold text-rose-700">
            {turfsQuery.error instanceof Error
              ? turfsQuery.error.message
              : 'Could not load turfs.'}
          </Text>
        </View>
      ) : turfsQuery.data?.length ? (
        <View className="gap-4">
          {turfsQuery.data.map((turf) => (
            <TurfCard key={turf.turf_field_id} turf={turf} />
          ))}
        </View>
      ) : (
        <View className="rounded-3xl border border-slate-200 bg-white px-5 py-6">
          <Text className="text-base font-semibold text-slate-900">
            No turfs available right now.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
