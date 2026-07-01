import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/src/context/AuthContext';
import { useCurrentUserQuery } from '@/src/hooks/use-auth';
import { deleteMyAccount } from '@/src/lib/api';
import { C, radius } from '@/src/lib/theme';

function SettingRow({
  icon,
  title,
  onPress,
  color,
  isLast,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  color?: string;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: C.border,
      }}
    >
      <Ionicons
        name={icon}
        size={20}
        color={color ?? C.textPrimary}
      />

      <Text
        style={{
          flex: 1,
          marginLeft: 14,
          fontSize: 15,
          fontWeight: '600',
          color: color ?? C.textPrimary,
        }}
      >
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={C.textMuted}
      />
    </Pressable>
  );
}


export default function ProfileScreen() {
  const { logout, clearSession } = useAuth();
  const { data: me } = useCurrentUserQuery();

  const [isDeleting, setIsDeleting] = useState(false);

  const initials = useMemo(() => {
    const name = me?.full_name?.trim();

    if (!name) return 'U';

    const parts = name.split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (
      (parts[0][0] ?? '') +
      (parts[1][0] ?? '')
    ).toUpperCase();
  }, [me?.full_name]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch {
              Alert.alert('Error', 'Logout failed');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    if (isDeleting) return;

    Alert.alert(
      'Delete Account',
      'This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);

              await deleteMyAccount();
              await clearSession();

              router.replace('/(auth)/login');
            } catch (err) {
              Alert.alert(
                'Error',
                err instanceof Error
                  ? err.message
                  : 'Failed to delete account'
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: C.bg,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 50,
        }}
      >
        {/* Header */}

        <View
          style={{
            alignItems: 'center',
            marginBottom: 28,
            paddingTop: 10,
          }}
        >
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: C.gold,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: '800',
                color: '#fff',
              }}
            >
              {initials}
            </Text>
          </View>

          <Text
            style={{
              marginTop: 14,
              fontSize: 24,
              fontWeight: '700',
              color: C.textPrimary,
            }}
          >
            {me?.full_name ?? 'User'}
          </Text>

          <Text
            style={{
              marginTop: 4,
              color: C.textSecondary,
              fontSize: 14,
            }}
          >
            {me?.email ?? ''}
          </Text>

          {me?.phone_no && (
            <Text
              style={{
                marginTop: 4,
                color: C.textMuted,
                fontSize: 13,
              }}
            >
              {me.phone_no}
            </Text>
          )}

          <View
            style={{
              marginTop: 12,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: me?.is_verified
                ? 'rgba(34,197,94,0.12)'
                : 'rgba(239,68,68,0.12)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <Ionicons
              name={
                me?.is_verified
                  ? 'checkmark-circle'
                  : 'close-circle'
              }
              size={14}
              color={
                me?.is_verified
                  ? '#22c55e'
                  : '#ef4444'
              }
            />

            <Text
              style={{
                marginLeft: 6,
                fontSize: 12,
                fontWeight: '700',
                color:
                  me?.is_verified
                    ? '#22c55e'
                    : '#ef4444',
              }}
            >
              {me?.is_verified
                ? 'Verified Account'
                : 'Not Verified'}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: C.card,
            borderRadius: radius.xl,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: C.border,
            marginBottom: 16,
          }}
        >
          <SettingRow
            icon="calendar-outline"
            title="My Bookings"
            onPress={() => router.push('/profile/bookings')}
            isLast
          />
        </View>

        {/* Support */}

        <View
          style={{
            backgroundColor: C.card,
            borderRadius: radius.xl,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <SettingRow
            icon="mail-outline"
            title="Contact Support"
            onPress={() =>
              Linking.openURL('mailto:tikitoapp@gmail.com').catch(() =>
                Alert.alert(
                  'Error',
                  'Could not open email client. Please reach out to tikitoapp@gmail.com'
                )
              )
            }
          />

          <SettingRow
            icon="document-text-outline"
            title="Privacy Policy"
            onPress={() =>
              Linking.openURL('https://tikitoapp.netlify.app/privacy-policy')
            }
          />
          <SettingRow
            icon="trash-outline"
            title="Delete Account"
            color={C.error}
            onPress={handleDeleteAccount}
            isLast
          />
        </View>

        <View
          style={{
            backgroundColor: C.card,
            borderRadius: radius.xl,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: C.border,
            marginTop: 16,
          }}
        >
          <SettingRow
            icon="log-out-outline"
            title="Logout"
            color={C.gold}
            onPress={handleLogout}
            isLast
          />
        </View>

        <Text
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 12,
            color: C.textMuted,
            fontWeight: '600',
          }}
        >
          Tikito v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}