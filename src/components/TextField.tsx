import { useState } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';
import { C, radius } from '@/src/lib/theme';

type TextFieldProps = TextInputProps & { label: string };

export function TextField({ label, style, ...props }: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: 18, width: '100%' }}>
      <Text style={{ marginLeft: 4, marginBottom: 8, fontSize: 11, fontWeight: '600', color: C.textMuted, letterSpacing: 1.2, fontFamily: C.sans }}>
        {label}
      </Text>
      <View style={{
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: isFocused ? C.gold : C.border,
        backgroundColor: C.elevated,
        paddingHorizontal: 16,
      }}>
        <TextInput
          style={[{ height: 52, fontSize: 16, color: C.textPrimary, fontFamily: C.sans }, style]}
          placeholderTextColor={C.textMuted}
          selectionColor={C.gold}
          cursorColor={C.gold}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
    </View>
  );
}
