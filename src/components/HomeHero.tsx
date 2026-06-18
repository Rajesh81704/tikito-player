import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { C, radius } from '@/src/lib/theme';

export function HomeHero() {
  return (
    <View style={{ borderRadius: radius.xl, overflow: 'hidden', aspectRatio: 1, backgroundColor: C.card }}>
      <ImageBackground source={require('@/assets/images/hero.png')} resizeMode="cover" style={{ flex: 1 }}>
        {/* Dark gradient overlay */}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />

        {/* Gold grain overlay for texture */}
        <View style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundColor: C.gold }} />

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 28, paddingBottom: 32 }}>
          {/* Tag line */}
          <View style={{ alignSelf: 'flex-start', borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)', paddingHorizontal: 12, paddingVertical: 5, marginBottom: 14, backgroundColor: 'rgba(201,168,76,0.1)' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.gold, letterSpacing: 1.5, fontFamily: C.sans }}>
              TURF BOOKING
            </Text>
          </View>

          <Text style={{ fontSize: 32, fontWeight: '800', color: C.textPrimary, fontFamily: C.serif, lineHeight: 40, alignSelf: 'flex-start', marginBottom: 24, letterSpacing: -0.5 }}>
            Book Venues{'\n'}With The{'\n'}Best Offers.
          </Text>

          <Pressable
            onPress={() => router.replace('/(tabs)/discover')}
            style={({ pressed }) => ({
              width: '100%',
              height: 54,
              borderRadius: radius.full,
              backgroundColor: C.gold,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transform: [{ scale: pressed ? 0.97 : 1 }],
              opacity: pressed ? 0.92 : 1,
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.bg, fontFamily: C.serif }}>
              Discover Turfs
            </Text>
            <Ionicons name="arrow-forward" size={18} color={C.bg} />
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}
