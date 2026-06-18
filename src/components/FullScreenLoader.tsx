import { ActivityIndicator, Text, View } from 'react-native';
import { C } from '@/src/lib/theme';

export function FullScreenLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, gap: 16, paddingHorizontal: 24 }}>
      <ActivityIndicator color={C.gold} size="large" />
      <Text style={{ fontSize: 13, color: C.textMuted, fontFamily: C.sans, letterSpacing: 0.4 }}>
        {label}
      </Text>
    </View>
  );
}
