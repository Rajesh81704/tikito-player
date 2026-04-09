import { ActivityIndicator, Text, View } from 'react-native';

type FullScreenLoaderProps = {
  label?: string;
};

export function FullScreenLoader({
  label = 'Loading...',
}: FullScreenLoaderProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-slate-50 px-6">
      <ActivityIndicator color="#0F766E" size="large" />
      <Text className="text-[15px] text-slate-600">{label}</Text>
    </View>
  );
}
