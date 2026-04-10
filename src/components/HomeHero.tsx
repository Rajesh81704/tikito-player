import React from 'react';
import { View, Text, Pressable, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export function HomeHero() {
  return (
    <View
      className="w-full overflow-hidden rounded-[32px] shadow-sm bg-slate-900"
      style={{ aspectRatio: 1 }}
    >
      <ImageBackground
        source={require('@/assets/images/hero.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="absolute inset-0 bg-black/10" />

        <View className="flex-1 items-center justify-between px-8 pt-12 pb-10">
          {/* Spacer for the football in image */}
          <View className="h-1/2 w-full" />

          <Text className="text-center text-3xl font-black tracking-tighter text-white leading-[42px]">
            Book Venues With{'\n'}The Best Offers!
          </Text>

          <Pressable
            onPress={() => router.replace('/(tabs)/discover')}
            className="w-full h-16 mt-4 rounded-full bg-white flex-row items-center justify-center active:scale-[0.97] active:opacity-95"
          >
            <Text className="text-lg font-bold text-slate-900 tracking-tight">
              Discover
            </Text>
            <View className="ml-2">
              <Ionicons name="arrow-forward-sharp" size={20} color="#0f172a" />
            </View>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}
