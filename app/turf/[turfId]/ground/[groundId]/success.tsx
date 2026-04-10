import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingSuccessScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <View className="rounded-[28px] border border-slate-200 bg-white p-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <Text className="text-[28px] font-black text-emerald-600">✓</Text>
          </View>

          <Text className="mt-6 text-3xl font-black tracking-tight text-slate-900">
            Booking successful
          </Text>

          <Text className="mt-3 text-base leading-7 text-slate-600">
            Your selected slots have been booked successfully. We&apos;ll see
            you on the turf soon.
          </Text>

          <View className="mt-6 rounded-2xl bg-emerald-50 px-4 py-4">
            <Text className="text-sm font-semibold text-emerald-700">
              Your booking is confirmed and ready.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            className="mt-6 min-h-[56px] flex-row items-center justify-between rounded-2xl bg-emerald-600 px-5"
            onPress={() => router.replace('/(tabs)')}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.99 : 1 }],
              opacity: pressed ? 0.96 : 1,
            })}
          >
            <View>
              <Text className="text-base font-black tracking-tight text-white">
                Go to Home
              </Text>
              <Text className="text-xs font-semibold text-emerald-50">
                Continue exploring nearby turfs
              </Text>
            </View>

            <View className="h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Text className="text-lg font-black text-white">→</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
