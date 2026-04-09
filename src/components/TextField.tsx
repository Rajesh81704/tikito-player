import { Text, TextInput, type TextInputProps, View } from 'react-native';

type TextFieldProps = TextInputProps & {
  label: string;
};

export function TextField({
  label,
  multiline = false,
  className,
  ...props
}: TextFieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-slate-900">{label}</Text>
      <TextInput
        className={`min-h-[52px] rounded-[14px] border border-slate-300 bg-white px-4 text-[15px] text-slate-900 ${
          multiline ? 'min-h-24 pt-[14px]' : ''
        } ${className ?? ''}`}
        multiline={multiline}
        placeholderTextColor="#94A3B8"
        {...props}
      />
    </View>
  );
}
