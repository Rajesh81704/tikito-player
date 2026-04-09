import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { useStoredLocation } from '@/src/hooks/use-stored-location';

export function HomeHeaderTitle() {
  const { location } = useStoredLocation();

  return (
    <View className="items-center">
      <Text className="text-[28px] font-bold text-slate-900">Home</Text>
      <View className="mt-0.5 flex-row items-center gap-1">
        <Ionicons color="#0F766E" name="location-sharp" size={14} />
        <Text className="text-sm font-medium text-slate-500">
          {location?.city ?? 'Set your city'}
        </Text>
      </View>
    </View>
  );
}
