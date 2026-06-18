import { ActivityIndicator, Pressable, type PressableProps, Text } from 'react-native';
import { C, radius } from '@/src/lib/theme';

type ButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({
  title,
  loading = false,
  variant = 'primary',
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const bg =
    variant === 'primary'
      ? C.card
      : variant === 'secondary'
      ? C.elevated
      : 'transparent';

  const textColor =
    variant === 'primary'
      ? C.gold
      : variant === 'ghost'
      ? C.gold
      : C.textPrimary;

  const borderColor =
    variant === 'primary'
      ? C.goldDim
      : variant === 'ghost'
      ? C.border
      : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => ({
        minHeight: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.lg,
        paddingHorizontal: 20,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor,
        opacity: isDisabled ? 0.5 : pressed ? 0.88 : 1,
        transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
      })}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={C.gold} />
      ) : (
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: textColor,
            fontFamily: C.serif,
            letterSpacing: 0.2,
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}