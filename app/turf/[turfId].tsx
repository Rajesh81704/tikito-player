import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { GroundCard } from '@/src/components/GroundCard';
import { useGroundDetailsQuery } from '@/src/hooks/use-auth';
import type { Turf } from '@/src/lib/api';
import { getFirstImage } from '@/src/lib/images';

function splitPillValues(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const FACILITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Parking: 'car-outline',
  Floodlights: 'flashlight-outline',
  Washroom: 'water-outline',
  'Drinking Water': 'pint-outline',
  Seating: 'people-outline',
  'Changing Room': 'shirt-outline',
};

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
  const remoteImage = getFirstImage(turf?.turf_images ?? null);
  const facilityItems = splitPillValues(turf?.turf_facilities ?? null);
  const ruleItems = splitPillValues(turf?.turf_rules ?? null);

  if (!turf) {
    return <FullScreenLoader label="Loading turf details..." />;
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['left', 'right', 'bottom']}
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="relative">
          <View className="h-80 w-full bg-slate-200">
            {remoteImage ? (
              <Image
                source={{ uri: remoteImage }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center bg-slate-100">
                <Ionicons name="football-outline" size={64} color="#cbd5e1" />
              </View>
            )}
            <View className="absolute inset-0 bg-slate-950/25" />
            <View className="absolute inset-x-0 bottom-0 h-32 bg-slate-950/25" />
          </View>

          <View className="absolute inset-x-0 bottom-0 px-5 pb-6">
            <View className="gap-2">
              <Text className="text-[32px] font-black leading-9 tracking-tighter text-white">
                {turf.turf_name}
              </Text>

              <View className="flex-row items-center">
                <Ionicons name="location-sharp" size={16} color="#34d399" />
                <Text className="ml-1.5 flex-1 text-sm font-semibold text-white/90">
                  {turf.turf_address ?? 'Address unavailable'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="gap-5 px-5 pt-5">
          <View className="gap-2 px-1 pt-2">
            <Text className="text-2xl font-black tracking-tight text-slate-900">
              Select Your Ground
            </Text>
            <Text className="text-sm leading-6 text-slate-500">
              Tap any ground to explore upcoming slots.
            </Text>
          </View>

          <View>
            {groundsQuery.isLoading ? (
              <FullScreenLoader label="Loading grounds..." />
            ) : groundsQuery.isError ? (
              <View className="rounded-[24px] bg-rose-50 px-5 py-6">
                <Text className="text-base font-semibold text-rose-700">
                  {groundsQuery.error instanceof Error
                    ? groundsQuery.error.message
                    : 'Could not load grounds.'}
                </Text>
              </View>
            ) : groundsQuery.data?.length ? (
              <View className="flex-row flex-wrap">
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
              <View className="rounded-[24px] border border-slate-200 bg-white px-5 py-6">
                <Text className="text-base font-semibold text-slate-900">
                  No grounds available for this turf yet.
                </Text>
              </View>
            )}
          </View>

          <View className="gap-3 rounded-[30px] border border-slate-100 bg-white p-5">
            <Text className="text-xl font-black tracking-tight text-slate-900">
              Facilities
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {facilityItems.length ? (
                facilityItems.map((facility) => (
                  <View
                    className="h-12 w-12 items-center justify-center rounded-full border border-slate-100 bg-slate-50"
                    key={facility}
                  >
                    <Ionicons
                      color="#059669"
                      name={FACILITY_ICONS[facility] ?? 'help-circle-outline'}
                      size={20}
                    />
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

            <Text className="text-xl font-black tracking-tight text-slate-900">
              Rules
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {ruleItems.length ? (
                ruleItems.map((rule) => (
                  <View
                    className="rounded-full bg-amber-50 px-4 py-2"
                    key={rule}
                  >
                    <Text className="text-xs font-bold text-amber-700">
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
      </ScrollView>
    </SafeAreaView>
  );
}
