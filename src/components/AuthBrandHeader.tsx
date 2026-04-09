import { Text, View } from 'react-native';

type AuthBrandHeaderProps = {
  subtitle: string;
  className?: string;
};

export function AuthBrandHeader({ subtitle, className }: AuthBrandHeaderProps) {
  return (
    <View className={`mb-12 ${className ?? ''}`}>
      <Text className="text-4xl font-black tracking-tighter text-emerald-600">
        Tikito.
      </Text>
      <Text className="mt-3 max-w-[320px] text-[17px] leading-7 text-slate-600">
        {subtitle}
      </Text>
    </View>
  );
}
