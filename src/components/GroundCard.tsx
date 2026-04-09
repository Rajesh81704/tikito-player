import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { type Ground } from '@/src/lib/api';

type GroundCardProps = {
  ground: Ground;
  onPress: () => void;
};

export function GroundCard({ ground, onPress }: GroundCardProps) {
  return (
    <Pressable
      className="gap-3 rounded-3xl border border-slate-200 bg-white p-4"
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View className="gap-1">
        <Text className="text-lg font-bold text-slate-900">
          {ground.ground_name}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Ionicons color="#0F766E" name="location-sharp" size={13} />
          <Text className="flex-1 text-sm text-slate-600">
            {ground.ground_loc ?? 'Location unavailable'}
          </Text>
        </View>
      </View>

      <View className="gap-2">
        <View className="self-start rounded-full bg-slate-100 px-3 py-1.5">
          <Text className="text-xs font-semibold uppercase tracking-[0.5px] text-slate-700">
            {ground.ground_type ?? 'Unknown type'}
          </Text>
        </View>

        <View className="self-start rounded-full bg-teal-50 px-3 py-1.5">
          <Text className="text-xs font-semibold uppercase tracking-[0.5px] text-teal-700">
            {ground.slots.length} slot{ground.slots.length === 1 ? '' : 's'}
          </Text>
        </View>

        <View
          className={`self-start flex-row items-center gap-1 rounded-full px-3 py-1.5 ${
            ground.is_active ? 'bg-emerald-50' : 'bg-rose-50'
          }`}
        >
          <Ionicons
            color={ground.is_active ? '#15803D' : '#BE123C'}
            name={ground.is_active ? 'checkmark-circle' : 'close-circle'}
            size={14}
          />
          <Text
            className={`text-xs font-semibold uppercase tracking-[0.5px] ${
              ground.is_active ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {ground.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
