import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Turf } from '@/src/lib/api';
import { getFirstImage } from '@/src/lib/images';

type HomeTurfCardProps = {
  turf: Turf;
  onPress?: () => void;
};

export function HomeTurfCard({ turf, onPress }: HomeTurfCardProps) {
  const imageUrl = getFirstImage(turf.turf_images ?? null);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
      className="overflow-hidden rounded-[24px] bg-slate-50 border border-slate-100 shadow-sm"
    >
      {/* Visual Area */}
      <View className="h-40 w-full bg-slate-200">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-slate-100">
            <Ionicons name="football-outline" size={40} color="#cbd5e1" />
          </View>
        )}
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
