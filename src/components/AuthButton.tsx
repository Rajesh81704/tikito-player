import { ActivityIndicator, Pressable, Text } from 'react-native';
import { C, radius } from '@/src/lib/theme';

type AuthButtonProps = {
  title: string;
  loading?: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function AuthButton({
  title,
  loading,
  onPress,
  disabled,
}: AuthButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={{ color: C.goldLight }}
      style={{
        height: 54,
        width: '100%',
        borderRadius: radius.lg,
        backgroundColor: C.gold,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isDisabled ? 0.5 : 1,
        overflow: 'hidden',
      }}
    >
      {loading ? (
        <ActivityIndicator color={C.bg} />
      ) : (
        <Text
          style={{
            fontSize: 17,
            fontWeight: '700',
            color: C.bg,
            fontFamily: C.serif,
            letterSpacing: 0.3,
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}