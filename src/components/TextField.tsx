import { useState } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';

type TextFieldProps = TextInputProps & {
  label: string;
};

export function TextField({ label, className, ...props }: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`mb-5 w-full gap-1.5 ${className ?? ''}`}>
      <Text className="ml-1 text-[13px] font-semibold text-slate-500">
        {label}
      </Text>
      <View
        className={`rounded-2xl border bg-slate-50 px-4 ${
          isFocused ? 'border-emerald-500 bg-white' : 'border-slate-200'
        }`}
      >
        <TextInput
          style={{ height: 50 }} // Explicit height for touch reliability
          className="text-[16px] text-slate-900"
          placeholderTextColor="#94a3b8"
          selectionColor="#10b981"
          cursorColor="#10b981"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
    </View>
  );
}
