import { Text, View } from 'react-native';
import { C } from '@/src/lib/theme';

type Props = { subtitle: string; className?: string };

export function AuthBrandHeader({ subtitle }: Props) {
  return (
    <View style={{ marginBottom: 40 }}>
      <Text style={{ fontSize: 38, fontWeight: '800', color: C.gold, fontFamily: C.serif, letterSpacing: -0.5 }}>
        Tikito.
      </Text>
      <Text style={{ marginTop: 10, fontSize: 16, lineHeight: 26, color: C.textSecondary, fontFamily: C.sans, maxWidth: 300 }}>
        {subtitle}
      </Text>
    </View>
  );
}
