import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  Text,
} from 'react-native';

type ButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export function Button({
  title,
  loading = false,
  variant = 'primary',
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const buttonClassName =
    variant === 'primary' ? 'bg-teal-700' : 'bg-slate-200';
  const textClassName =
    variant === 'primary'
      ? 'text-base font-bold text-white'
      : 'text-base font-bold text-slate-900';

  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-[52px] items-center justify-center rounded-2xl px-[18px] ${
        isDisabled ? 'opacity-70' : ''
      } ${buttonClassName} ${className ?? ''}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : '#0F172A'}
        />
      ) : (
        <Text className={textClassName}>{title}</Text>
      )}
    </Pressable>
  );
}
