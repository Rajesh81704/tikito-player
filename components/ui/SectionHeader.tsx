import { Pressable, Text, View } from 'react-native';

export function SectionHeader({
  title,
  actionText,
  onActionPress,
}: {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="text-xl font-bold text-gray-900">{title}</Text>
      {actionText ? (
        <Pressable
          accessibilityRole="button"
          onPress={onActionPress}
          className="rounded-xl px-3 py-2"
        >
          <Text className="text-sm font-semibold text-green-700">
            {actionText}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
