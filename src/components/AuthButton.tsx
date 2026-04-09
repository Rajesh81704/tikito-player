import { ActivityIndicator, Pressable, Text } from 'react-native';

type AuthButtonProps = {
  title: string;
  loading?: boolean;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
};

export function AuthButton({
  title,
  loading,
  onPress,
  disabled,
  className,
}: AuthButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`h-[52px] w-full flex-row items-center justify-center rounded-2xl bg-emerald-600 shadow-sm ${
        className ?? ''
      }`}
      style={({ pressed }) => ({
        opacity: isDisabled ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-lg font-bold tracking-tight text-white">
          {title}
        </Text>
      )}
    </Pressable>
  );
}
