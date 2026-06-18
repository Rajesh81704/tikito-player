import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { C } from '@/src/lib/theme';

interface SettingsItemProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
  isLast?: boolean;
  rightElement?: React.ReactNode;
}

export function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  color,
  isLast = false,
  rightElement,
}: SettingsItemProps) {
  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingHorizontal: 16,
          paddingVertical: 14,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: color ? 'rgba(224,82,82,0.1)' : C.elevated,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: color ? 'rgba(224,82,82,0.2)' : C.border,
          }}
        >
          <Ionicons name={icon} size={19} color={color ?? C.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: color ?? C.textPrimary,
              fontFamily: C.sans,
            }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={1}
              style={{
                marginTop: 2,
                fontSize: 12,
                color: C.textMuted,
                fontFamily: C.sans,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        {rightElement || <Ionicons name="chevron-forward" size={15} color={C.textMuted} />}
      </Pressable>
      {!isLast && (
        <View
          style={{
            height: 1,
            backgroundColor: C.border,
            marginLeft: 68,
            marginRight: 16,
            opacity: 0.5,
          }}
        />
      )}
    </>
  );
}
