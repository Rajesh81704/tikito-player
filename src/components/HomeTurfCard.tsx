import React, { useMemo } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Turf } from '@/src/lib/api';

type HomeTurfCardProps = {
  turf: Turf;
  onPress?: () => void;
};

export function HomeTurfCard({ turf, onPress }: HomeTurfCardProps) {
  const randomImage = useMemo(() => {
    const images = [
      require('@/assets/images/img1.jpg'),
      require('@/assets/images/img2.jpg'),
      require('@/assets/images/img3.jpg'),
      require('@/assets/images/img4.jpg'),
      require('@/assets/images/img5.jpg'),
      require('@/assets/images/img6.jpg'),
    ];
    return images[Math.floor(Math.random() * images.length)];
  }, []);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
      className="overflow-hidden rounded-[24px] bg-slate-50 border border-slate-100 shadow-sm"
    >
      {/* Visual Area */}
      <View className="h-40 w-full">
        <Image
          source={randomImage}
          className="h-full w-full"
          resizeMode="cover"
        />
        {/* Grounds Badge */}
        {turf.no_of_grounds && (
          <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-lg">
            <Text className="text-[10px] font-bold text-white uppercase">
              {turf.no_of_grounds}{' '}
              {turf.no_of_grounds === 1 ? 'Ground' : 'Grounds'}
            </Text>
          </View>
        )}
      </View>

      {/* Info Area */}
      <View className="p-4">
        <Text
          numberOfLines={1}
          className="text-lg font-black tracking-tight text-slate-900"
        >
          {turf.turf_name}
        </Text>

        <View className="flex-row items-center mt-1">
          <Ionicons name="location" size={14} color="#10b981" />
          <Text
            numberOfLines={1}
            className="ml-1 text-sm font-bold text-slate-500"
          >
            {turf.turf_location || 'Nearby'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
