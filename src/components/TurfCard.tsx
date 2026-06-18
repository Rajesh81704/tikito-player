import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import { C, radius } from '@/src/lib/theme';
import type { Turf } from '@/src/lib/api';

export function TurfCard({ turf, onPress }: { turf: Turf; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: C.border,
        backgroundColor: C.card,
        padding: 18,
        gap: 12,
        opacity: pressed ? 0.88 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif }}>
          {turf.turf_name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="location-sharp" size={13} color={C.green} />
          <Text style={{ flex: 1, fontSize: 13, color: C.textSecondary, fontFamily: C.sans }}>
            {turf.turf_location ?? 'Location unavailable'}
          </Text>
        </View>
      </View>
      <View style={{ alignSelf: 'flex-start', borderRadius: radius.full, backgroundColor: C.greenSoft, borderWidth: 1, borderColor: C.greenBorder, paddingHorizontal: 12, paddingVertical: 6 }}>
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.green, letterSpacing: 0.5, fontFamily: C.sans }}>
          {turf.no_of_grounds ?? 0} ground{turf.no_of_grounds === 1 ? '' : 's'}
        </Text>
      </View>
    </Pressable>
  );
}
