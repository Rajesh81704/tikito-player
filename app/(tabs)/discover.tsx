import { Text, View } from 'react-native';

export default function DiscoverScreen() {
  return (
    <View className="flex-1 justify-center gap-2.5 px-5">
      <Text className="text-3xl font-bold text-slate-900">Discover</Text>
      <Text className="text-base leading-6 text-slate-600">
        This tab is ready for nearby turfs, city search, and live availability.
      </Text>
    </View>
  );
}
