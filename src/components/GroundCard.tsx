import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import type { Ground } from '@/src/lib/api';

type GroundCardProps = {
  ground: Ground;
  onPress: () => void;
};

export function GroundCard({ ground, onPress }: GroundCardProps) {
  const hasSlots = ground.slots.length > 0;

  return (
    <Pressable
      className="rounded-[24px] border border-slate-100 bg-white p-4"
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
        opacity: pressed ? 0.96 : 1,
      })}
    >
      <View className="gap-3">
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
            {hasSlots
              ? `${ground.slots.length} slot${ground.slots.length === 1 ? '' : 's'}`
              : 'No slots available'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
