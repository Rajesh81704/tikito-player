import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, Text, View } from 'react-native';
import { C, radius } from '@/src/lib/theme';
import type { Ground } from '@/src/lib/api';
import { getFirstImage } from '@/src/lib/images';

export function GroundCard({ ground, onPress }: { ground: Ground; onPress: () => void }) {
  const hasSlots = ground.slots.length > 0;
  const imageUrl = getFirstImage(ground.ground_images ?? null);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: C.border,
        backgroundColor: C.card,
        overflow: 'hidden',
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.9 : 1,
      })}
    >
      {imageUrl && (
        <View style={{ height: 90, backgroundColor: C.elevated }}>
          <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.15)' }} />
        </View>
      )}
      <View style={{ padding: 14, gap: 10 }}>
        <View style={{ width: 38, height: 38, borderRadius: 999, backgroundColor: C.greenSoft, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.greenBorder }}>
          <Ionicons name="football-outline" size={17} color={C.green} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif }}>
          {ground.ground_name}
        </Text>
        {ground.ground_type ? (
          <Text style={{ fontSize: 11, color: C.textMuted, fontFamily: C.sans }}>
            {ground.ground_type}
          </Text>
        ) : null}
        <View style={{
          alignSelf: 'flex-start',
          borderRadius: radius.full,
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: hasSlots ? C.greenSoft : 'rgba(224,82,82,0.1)',
          borderWidth: 1,
          borderColor: hasSlots ? C.greenBorder : 'rgba(224,82,82,0.25)',
        }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: hasSlots ? C.green : C.error, letterSpacing: 0.4, fontFamily: C.sans }}>
            {hasSlots ? 'View Slots →' : 'No slots'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
