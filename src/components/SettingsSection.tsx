import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { C, radius } from '@/src/lib/theme';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function SettingsSection({ title, children, defaultExpanded = true }: SettingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View style={{ marginTop: 20, marginHorizontal: 16 }}>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
          paddingHorizontal: 4,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            color: C.textMuted,
            letterSpacing: 1.2,
            fontFamily: C.sans,
          }}
        >
          {title.toUpperCase()}
        </Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={C.textMuted}
        />
      </Pressable>
      {isExpanded && (
        <View
          style={{
            backgroundColor: C.card,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: C.border,
            overflow: 'hidden',
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
}
