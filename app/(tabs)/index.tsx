import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center gap-2.5 px-5">
      <Text className="text-3xl font-bold text-slate-900">Home</Text>
      <Text className="text-base leading-6 text-slate-600">
        Your player home is ready for upcoming turf discovery and booking
        features.
      </Text>
    </View>
  );
}
