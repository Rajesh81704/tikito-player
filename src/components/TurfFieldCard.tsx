import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, Text, View } from 'react-native';
import { C, radius } from '@/src/lib/theme';
import type { Turf } from '@/src/lib/api';
import { getFirstImage } from '@/src/lib/images';

const FACILITY_ICONS: Record<string, string> = {
  Parking: 'car-outline',
  Floodlights: 'flashlight-outline',
  Washroom: 'water-outline',
  'Drinking Water': 'pint-outline',
  Seating: 'people-outline',
  'Changing Room': 'shirt-outline',
};

export function TurfFieldCard({ turf, onPress }: { turf: Turf; onPress?: () => void }) {
  const imageUrl = getFirstImage(turf.turf_images ?? null);
  const facilities = turf.turf_facilities ? turf.turf_facilities.split(',').map(f => f.trim()) : [];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        borderRadius: radius.xl,
        overflow: 'hidden',
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      {/* Image */}
      <View style={{ height: 120, backgroundColor: C.elevated }}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="football-outline" size={28} color={C.border} />
          </View>
        )}
        {turf.no_of_grounds ? (
          <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7 }}>
            <Text style={{ fontSize: 9, fontWeight: '700', color: C.textPrimary, letterSpacing: 0.5 }}>
              {turf.no_of_grounds}{turf.no_of_grounds === 1 ? ' GND' : ' GNDS'}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Content */}
      <View style={{ padding: 12, gap: 4 }}>
        <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif }}>
          {turf.turf_name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="location-sharp" size={11} color={C.textMuted} />
          <Text numberOfLines={1} style={{ fontSize: 11, color: C.textMuted, fontFamily: C.sans, flex: 1 }}>
            {turf.turf_location}
          </Text>
        </View>
        {facilities.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {facilities.slice(0, 4).map((f, i) => (
              <View key={i} style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 999, backgroundColor: C.elevated, borderWidth: 1, borderColor: C.border }}>
                <Ionicons name={(FACILITY_ICONS[f] || 'help-circle-outline') as any} size={13} color={C.green} />
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
}
