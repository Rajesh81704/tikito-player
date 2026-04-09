import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';

export default function BookingSuccessScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <View className="items-center gap-3 rounded-[32px] border border-emerald-100 bg-white px-6 py-8">
          <Text className="text-3xl font-bold text-slate-900">
            Booking successful
          </Text>
          <Text className="text-center text-base leading-6 text-slate-600">
            Your selected slots have been booked successfully. We&apos;ll see
            you on the turf soon.
          </Text>
        </View>

        <Button
          className="w-full"
          onPress={() => router.replace('/(tabs)')}
          title="Go to Home"
        />
      </View>
    </SafeAreaView>
  );
}
