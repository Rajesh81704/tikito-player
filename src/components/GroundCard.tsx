import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, Text, View } from 'react-native';

import type { Ground } from '@/src/lib/api';
import { getFirstImage } from '@/src/lib/images';

type GroundCardProps = {
  ground: Ground;
  onPress: () => void;
};

export function GroundCard({ ground, onPress }: GroundCardProps) {
  const hasSlots = ground.slots.length > 0;
  const imageUrl = getFirstImage(ground.ground_images ?? null);

  return (
    <Pressable
      className="rounded-[24px] border border-slate-100 bg-white overflow-hidden"
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
        opacity: pressed ? 0.96 : 1,
      })}
    >
      {imageUrl ? (
        <View className="h-24 w-full bg-slate-200">
          <Image
            source={{ uri: imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>
      ) : null}

      <View className="gap-3 p-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-50">
          <Ionicons name="football-outline" size={18} color="#059669" />
        </View>

        <Text className="text-base font-black tracking-tight text-slate-900">
          {ground.ground_name}
        </Text>

        <View
          className={`self-start rounded-full px-3 py-1.5 ${
            hasSlots ? 'bg-emerald-50' : 'bg-rose-50'
          }`}
        >
          <Text
            className={`text-xs font-bold uppercase tracking-[0.5px] ${
              hasSlots ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {hasSlots ? 'View Slots →' : 'No slots configured'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
