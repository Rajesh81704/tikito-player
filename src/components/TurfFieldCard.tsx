import React, { useMemo } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type Turf } from '@/src/lib/api';
import { getFirstImage } from '@/src/lib/images';

type TurfCardProps = {
  turf: Turf;
  onPress?: () => void;
};

// Facility to Icon Mapping
const FACILITY_ICONS: Record<
  string,
  keyof typeof Ionicons.prototype.props.name
> = {
  Parking: 'car-outline',
  Floodlights: 'flashlight-outline',
  Washroom: 'water-outline',
  'Drinking Water': 'pint-outline',
  Seating: 'people-outline',
  'Changing Room': 'shirt-outline',
};

export function TurfFieldCard({ turf, onPress }: TurfCardProps) {
  const fallbackImage = useMemo(() => {
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

  const remoteImage = getFirstImage(turf.turf_images ?? null);

  // Convert comma separated string to array and trim
  const facilities = turf.turf_facilities
    ? turf.turf_facilities.split(',').map((f) => f.trim())
    : [];

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 overflow-hidden rounded-[20px] bg-slate-50 border border-slate-100"
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {/* Turf Image */}
      <View className="h-32 w-full bg-slate-200">
        <Image
          source={remoteImage ? { uri: remoteImage } : fallbackImage}
          className="h-full w-full object-cover"
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

      {/* Content */}
      <View className="p-3">
        <Text
          numberOfLines={1}
          className="text-base font-black tracking-tight text-slate-900"
        >
          {turf.turf_name}
        </Text>

        <View className="flex-row items-center mt-0.5">
          <Ionicons name="location-sharp" size={12} color="#64748b" />
          <Text
            numberOfLines={1}
            className="ml-1 text-[11px] font-medium text-slate-500 flex-1"
          >
            {turf.turf_location}
          </Text>
        </View>

        {/* Facility Icons */}
        <View className="flex-row flex-wrap gap-2 mt-3">
          {facilities.map((facility, index) => (
            <View
              key={`${turf.turf_field_id}-${index}`}
              className="h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-100"
            >
              <Ionicons
                name={FACILITY_ICONS[facility] || 'help-circle-outline'}
                size={14}
                color="#059669"
              />
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}
