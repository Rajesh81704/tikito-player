import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { type Turf } from '@/src/lib/api';

type TurfCardProps = {
  turf: Turf;
  onPress?: () => void;
};

export function TurfCard({ turf, onPress }: TurfCardProps) {
  return (
    <Pressable
      className="gap-3 rounded-3xl border border-slate-200 bg-white p-5"
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View className="gap-1.5">
        <Text className="text-xl font-bold text-slate-900">
          {turf.turf_name}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Ionicons color="#0F766E" name="location-sharp" size={14} />
          <Text className="flex-1 text-sm text-slate-600">
            {turf.turf_location ?? 'Location unavailable'}
          </Text>
        </View>
      </View>

      <View className="self-start rounded-full bg-teal-50 px-3 py-1.5">
        <Text className="text-xs font-semibold uppercase tracking-[0.5px] text-teal-700">
          {turf.no_of_grounds ?? 0} ground{turf.no_of_grounds === 1 ? '' : 's'}
        </Text>
      </View>
    </Pressable>
  );
}
