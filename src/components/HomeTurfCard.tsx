import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, Text, View } from 'react-native';
import { C, radius } from '@/src/lib/theme';
import type { Turf } from '@/src/lib/api';
import { getFirstImage } from '@/src/lib/images';

export function HomeTurfCard({ turf, onPress }: { turf: Turf; onPress?: () => void }) {
  const imageUrl = getFirstImage(turf.turf_images ?? null);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: radius.xl,
        overflow: 'hidden',
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.92 : 1,
      })}
    >
      {/* Image */}
      <View style={{ height: 150, backgroundColor: C.elevated }}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="football-outline" size={40} color={C.border} />
          </View>
        )}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
        {turf.no_of_grounds ? (
          <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.textPrimary, letterSpacing: 0.5, fontFamily: C.sans }}>
              {turf.no_of_grounds} {turf.no_of_grounds === 1 ? 'GROUND' : 'GROUNDS'}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Info */}
      <View style={{ padding: 14, gap: 6 }}>
        <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif }}>
          {turf.turf_name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="location" size={13} color={C.green} />
          <Text numberOfLines={1} style={{ fontSize: 12, color: C.textSecondary, fontFamily: C.sans, flex: 1 }}>
            {turf.turf_location || 'Nearby'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
