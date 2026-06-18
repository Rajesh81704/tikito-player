import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { GroundCard } from '@/src/components/GroundCard';
import { useGroundDetailsQuery } from '@/src/hooks/use-auth';
import type { Turf } from '@/src/lib/api';
import { getFirstImage } from '@/src/lib/images';
import { C, radius } from '@/src/lib/theme';

const FACILITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Parking: 'car-outline', Floodlights: 'flashlight-outline', Washroom: 'water-outline',
  'Drinking Water': 'pint-outline', Seating: 'people-outline', 'Changing Room': 'shirt-outline',
};

function splitPills(val: string | null) {
  return val ? val.split(',').map(i => i.trim()).filter(Boolean) : [];
}

export default function TurfDetailsScreen() {
  const params = useLocalSearchParams<{ turfId?: string; turf?: string }>();
  const turf = typeof params.turf === 'string' ? JSON.parse(params.turf) as Turf : null;
  const groundsQuery = useGroundDetailsQuery(typeof params.turfId === 'string' ? params.turfId : undefined, true);
  const remoteImage = getFirstImage(turf?.turf_images ?? null);
  const facilityItems = splitPills(turf?.turf_facilities ?? null);
  const ruleItems = splitPills(turf?.turf_rules ?? null);

  if (!turf) return <FullScreenLoader label="Loading turf details..." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['left', 'right', 'bottom']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={{ position: 'relative', height: 300 }}>
          {remoteImage ? (
            <Image source={{ uri: remoteImage }} style={{ width: '100%', height: 300 }} resizeMode="cover" />
          ) : (
            <View style={{ height: 300, backgroundColor: C.elevated, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="football-outline" size={64} color={C.border} />
            </View>
          )}
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)' }} />
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, backgroundColor: 'rgba(10,10,15,0.6)' }} />
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 20 }}>
            <Text style={{ fontSize: 30, fontWeight: '800', color: C.textPrimary, fontFamily: C.serif, lineHeight: 36, letterSpacing: -0.5 }}>
              {turf.turf_name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <Ionicons name="location-sharp" size={15} color={C.green} />
              <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: 'rgba(245,240,232,0.85)', fontFamily: C.sans }}>
                {turf.turf_address ?? 'Address unavailable'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 24 }}>
          {/* Select Ground */}
          <View>
            <Text style={{ fontSize: 22, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif, marginBottom: 6 }}>Select Your Ground</Text>
            <Text style={{ fontSize: 13, color: C.textSecondary, marginBottom: 16, fontFamily: C.sans }}>Tap any ground to explore upcoming slots.</Text>

            {groundsQuery.isLoading ? (
              <FullScreenLoader label="Loading grounds..." />
            ) : groundsQuery.isError ? (
              <View style={{ borderRadius: radius.lg, backgroundColor: 'rgba(224,82,82,0.08)', padding: 18, borderWidth: 1, borderColor: 'rgba(224,82,82,0.2)' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.error, fontFamily: C.sans }}>
                  {groundsQuery.error instanceof Error ? groundsQuery.error.message : 'Could not load grounds.'}
                </Text>
              </View>
            ) : groundsQuery.data?.length ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {groundsQuery.data.map(ground => (
                  <View key={ground.turf_ground_id} style={{ width: '47%' }}>
                    <GroundCard ground={ground} onPress={() => router.push({ pathname: '/turf/[turfId]/ground/[groundId]', params: { turfId: turf.turf_field_id, groundId: ground.turf_ground_id, turfName: turf.turf_name, groundName: ground.ground_name } })} />
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: C.border, padding: 18 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.textSecondary, fontFamily: C.sans }}>No grounds available for this turf yet.</Text>
              </View>
            )}
          </View>

          {/* Facilities & Rules */}
          <View style={{ borderRadius: radius.xl, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, padding: 20, gap: 18 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif, marginBottom: 14 }}>Facilities</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {facilityItems.length ? facilityItems.map(f => (
                  <View key={f} style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: C.elevated, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={FACILITY_ICONS[f] ?? 'help-circle-outline'} size={20} color={C.green} />
                  </View>
                )) : (
                  <Text style={{ fontSize: 13, color: C.textMuted, fontFamily: C.sans }}>No facilities listed</Text>
                )}
              </View>
            </View>

            <View style={{ height: 0.5, backgroundColor: C.border }} />

            <View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif, marginBottom: 14 }}>Rules</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {ruleItems.length ? ruleItems.map(r => (
                  <View key={r} style={{ borderRadius: radius.full, backgroundColor: 'rgba(232,168,56,0.08)', borderWidth: 1, borderColor: 'rgba(232,168,56,0.2)', paddingHorizontal: 14, paddingVertical: 7 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: C.warning, fontFamily: C.sans }}>{r}</Text>
                  </View>
                )) : (
                  <Text style={{ fontSize: 13, color: C.textMuted, fontFamily: C.sans }}>No rules listed</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
