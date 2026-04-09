import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { GroundCard } from '@/src/components/GroundCard';
import { useGroundDetailsQuery } from '@/src/hooks/use-auth';
import { type Turf } from '@/src/lib/api';

function splitPillValues(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function TurfDetailsScreen() {
  const params = useLocalSearchParams<{
    turfId?: string;
    turf?: string;
  }>();

  const turf =
    typeof params.turf === 'string' ? (JSON.parse(params.turf) as Turf) : null;

  const groundsQuery = useGroundDetailsQuery(
    typeof params.turfId === 'string' ? params.turfId : undefined,
    true,
  );
  const facilityItems = splitPillValues(turf?.turf_facilities ?? null);
  const ruleItems = splitPillValues(turf?.turf_rules ?? null);

  if (!turf) {
    return <FullScreenLoader label="Loading turf details..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-5 py-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3 rounded-[28px] border border-slate-200 bg-white p-5">
          <Text className="text-[28px] font-bold leading-8 text-slate-900">
            {turf.turf_name}
          </Text>
          <Text className="text-base leading-6 text-slate-600">
            {turf.turf_location ?? 'Location unavailable'}
          </Text>
          <Text className="text-sm text-slate-500">
            {turf.no_of_grounds ?? 0} ground
            {turf.no_of_grounds === 1 ? '' : 's'}
          </Text>

          <View className="gap-1.5">
            <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-400">
              Address
            </Text>
            <Text className="text-sm leading-6 text-slate-700">
              {turf.turf_address ?? 'Address unavailable'}
            </Text>
          </View>

          <View className="gap-2">
            <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-400">
              Facilities
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {facilityItems.length ? (
                facilityItems.map((facility) => (
                  <View
                    className="rounded-full bg-teal-50 px-3 py-1.5"
                    key={facility}
                  >
                    <Text className="text-xs font-semibold text-teal-700">
                      {facility}
                    </Text>
                  </View>
                ))
              ) : (
                <View className="rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-xs font-semibold text-slate-500">
                    No facilities listed
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-slate-400">
              Rules
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {ruleItems.length ? (
                ruleItems.map((rule) => (
                  <View
                    className="rounded-full bg-amber-50 px-3 py-1.5"
                    key={rule}
                  >
                    <Text className="text-xs font-semibold text-amber-700">
                      {rule}
                    </Text>
                  </View>
                ))
              ) : (
                <View className="rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-xs font-semibold text-slate-500">
                    No rules listed
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-2xl font-bold text-slate-900">Grounds</Text>
          <Text className="text-sm leading-6 text-slate-600">
            Tap any ground to explore upcoming booking flows.
          </Text>
        </View>

        {groundsQuery.isLoading ? (
          <FullScreenLoader label="Loading grounds..." />
        ) : groundsQuery.isError ? (
          <View className="rounded-3xl bg-rose-50 px-5 py-6">
            <Text className="text-base font-semibold text-rose-700">
              {groundsQuery.error instanceof Error
                ? groundsQuery.error.message
                : 'Could not load grounds.'}
            </Text>
          </View>
        ) : groundsQuery.data?.length ? (
          <View className="-mx-2 flex-row flex-wrap">
            {groundsQuery.data.map((ground) => (
              <View className="mb-4 w-1/2 px-2" key={ground.turf_ground_id}>
                <GroundCard
                  ground={ground}
                  onPress={() => {
                    router.push({
                      pathname: '/turf/[turfId]/ground/[groundId]',
                      params: {
                        turfId: turf.turf_field_id,
                        groundId: ground.turf_ground_id,
                        turfName: turf.turf_name,
                        groundName: ground.ground_name,
                      },
                    });
                  }}
                />
              </View>
            ))}
          </View>
        ) : (
          <View className="rounded-3xl border border-slate-200 bg-white px-5 py-6">
            <Text className="text-base font-semibold text-slate-900">
              No grounds available for this turf yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
