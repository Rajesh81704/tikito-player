import type { PropsWithChildren } from 'react';
import { Pressable, Text } from 'react-native';

type ChipProps = PropsWithChildren<{
  selected?: boolean;
  onPress?: () => void;
}>;

export function Chip({ selected, onPress, children }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`rounded-xl px-3 py-2 ${
        selected ? 'bg-green-500' : 'bg-gray-100'
      }`}
    >
      <Text
        className={`text-sm font-semibold ${selected ? 'text-white' : 'text-gray-900'}`}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}
