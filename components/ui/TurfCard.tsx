import type { ReactNode } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { Turf } from '@/data/turf';

type TurfCardProps = {
  turf: Turf;
  onPress: () => void;
  size?: 'default' | 'compact';
  rightAccessory?: ReactNode;
};

export function TurfCard({
  turf,
  onPress,
  size = 'default',
  rightAccessory,
}: TurfCardProps) {
  const isCompact = size === 'compact';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={[
        'bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden',
        // Width is controlled by the parent list/grid (important for FlatList numColumns)
        'w-full',
      ].join(' ')}
    >
      <Image
        source={{ uri: turf.image }}
        resizeMode="cover"
        className={isCompact ? 'h-24 w-full' : 'h-32 w-full'}
      />

      <View className={isCompact ? 'p-3 gap-1.5' : 'p-4 gap-2'}>
        <View className="flex-row items-start justify-between gap-2">
          <Text
            className={
              isCompact
                ? 'text-sm font-bold text-gray-900'
                : 'text-base font-bold text-gray-900'
            }
            numberOfLines={1}
          >
            {turf.name}
          </Text>
          {rightAccessory ? <View>{rightAccessory}</View> : null}
        </View>

        <View className="flex-row items-center gap-1">
          <Ionicons name="star" size={14} color="#eab308" />
          <Text className="text-sm font-semibold text-gray-700">
            {turf.rating.toFixed(1)}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text className="text-sm text-gray-600" numberOfLines={1}>
            {turf.location}
          </Text>
        </View>

        <View className="flex-row items-center justify-between pt-1">
          <Text className="text-sm font-bold text-green-700">
            ₹{turf.price}/hr
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
