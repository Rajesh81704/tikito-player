import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/src/context/AuthContext';
import { useCurrentUserQuery } from '@/src/hooks/use-auth';
import { useStoredLocation } from '@/src/hooks/use-stored-location';
import { deleteMyAccount } from '@/src/lib/api';

export default function ProfileScreen() {
  const { logout, clearSession } = useAuth();
  const { data: me } = useCurrentUserQuery();
  const { location } = useStoredLocation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const initials = useMemo(() => {
    const name = me?.full_name?.trim();
    if (!name) return 'U';
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }, [me?.full_name]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            router.replace('/(auth)/login');
          } catch {
            Alert.alert('Error', 'Logout failed.');
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    if (isDeleting) return;

    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteMyAccount();
              await clearSession();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error
                  ? error.message
                  : 'Delete account failed.',
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="bg-white px-6 pt-6 pb-8">
          <View className="flex-row items-center gap-4">
            {/* Avatar */}
            <View className="h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Text className="text-2xl font-black text-emerald-700">
                {initials}
              </Text>
            </View>

            {/* Name & Info */}
            <View className="flex-1">
              <Text className="text-xl font-black tracking-tight text-slate-900">
                {me?.full_name ?? 'User'}
              </Text>
              <Text className="mt-0.5 text-sm text-slate-500">
                {me?.email ?? 'No email'}
              </Text>
              <View className="mt-2 flex-row items-center">
                <Ionicons name="location-sharp" size={12} color="#10b981" />
                <Text className="ml-1 text-xs font-semibold text-emerald-700">
                  {location?.city ?? 'Location not set'}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View className="mt-6 flex-row gap-3">
            <View className="flex-1 items-center rounded-2xl bg-slate-50 py-3">
              <Text className="text-lg font-black text-slate-900">
                {me?.phone_no ?? '—'}
              </Text>
              <Text className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Phone
              </Text>
            </View>
            <View className="flex-1 items-center rounded-2xl bg-slate-50 py-3">
              <Text className="text-lg font-black text-emerald-600">
                {me?.is_verified ? '✓' : '✗'}
              </Text>
              <Text className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Verified
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View className="mt-4 bg-white px-4 py-2">
          <Text className="px-2 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
            Activity
          </Text>
          <MenuItem
            icon="calendar-outline"
            title="My Bookings"
            subtitle="View all your turf bookings"
            onPress={() => router.push('/profile/bookings')}
          />
        </View>

        <View className="mt-4 bg-white px-4 py-2">
          <Text className="px-2 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
            Account
          </Text>
          <MenuItem
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => router.push('/(auth)/forgot-password')}
          />
          <Separator />
          <MenuItem
            icon="log-out-outline"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            color="#ef4444"
          />
        </View>

        <View className="mt-4 bg-white px-4 py-2">
          <Pressable
            onPress={() => setShowHelp(!showHelp)}
            className="flex-row items-center justify-between px-2 py-3"
          >
            <Text className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Help & Support
            </Text>
            <Ionicons
              name={showHelp ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#94a3b8"
            />
          </Pressable>

          {showHelp && (
            <View>
              <MenuItem
                icon="help-circle-outline"
                title="FAQ"
                subtitle="Frequently asked questions"
                onPress={() =>
                  Alert.alert('FAQ', undefined, [
                    { text: 'Close' },
                  ], { cancelable: true })
                }
              />
              <Separator />
              <MenuItem
                icon="chatbubble-ellipses-outline"
                title="Contact Support"
                subtitle="mail@tikito.in · 7709797951"
                onPress={() =>
                  Alert.alert('Contact Support', 'How would you like to reach us?', [
                    {
                      text: 'Email',
                      onPress: () => Linking.openURL('mailto:mail@tikito.in'),
                    },
                    {
                      text: 'Call',
                      onPress: () => Linking.openURL('tel:7709797951'),
                    },
                    { text: 'Cancel', style: 'cancel' },
                  ])
                }
              />
              <Separator />
              <MenuItem
                icon="trash-outline"
                title="Delete Account"
                subtitle="Permanently remove your account"
                onPress={handleDeleteAccount}
                color="#ef4444"
              />
            </View>
          )}
        </View>

        {/* FAQ Section - only visible when help is expanded */}
        {showHelp && (
          <View className="mt-4 bg-white px-4 py-2">
            <Text className="px-2 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
              Frequently Asked Questions
            </Text>
            <FaqItem
              question="How do I book a turf?"
              answer="Browse turfs from the Home or Discover tab, select a ground, pick your preferred time slots, and proceed to payment."
            />
            <Separator />
            <FaqItem
              question="Can I cancel a booking?"
              answer="Currently, cancellations are handled by the turf owner. Please contact the turf directly or reach out to our support team."
            />
            <Separator />
            <FaqItem
              question="What payment methods are accepted?"
              answer="We accept UPI, credit/debit cards, and net banking through Razorpay's secure payment gateway."
            />
            <Separator />
            <FaqItem
              question="How do I get a refund?"
              answer="Refunds are processed within 5-7 business days after a cancellation is approved by the turf owner."
            />
            <Separator />
            <FaqItem
              question="Is my payment information safe?"
              answer="Yes. All payments are processed by Razorpay with 256-bit SSL encryption. We never store your card details."
            />
          </View>
        )}

        {/* App Info */}
        <View className="mt-6 items-center">
          <Text className="text-xs font-medium text-slate-300">
            Tikito v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Separator() {
  return <View className="mx-2 h-px bg-slate-100" />;
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  color,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 rounded-xl px-2 py-4"
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#f8fafc' : 'transparent',
      })}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: color ? '#fef2f2' : '#f0fdf4' }}
      >
        <Ionicons name={icon} size={20} color={color ?? '#059669'} />
      </View>

      <View className="flex-1">
        <Text
          className="text-[15px] font-bold"
          style={{ color: color ?? '#0f172a' }}
        >
          {title}
        </Text>
        <Text className="mt-0.5 text-xs text-slate-400">{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
    </Pressable>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      className="px-2 py-4"
    >
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-[14px] font-bold text-slate-800">
          {question}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#94a3b8"
        />
      </View>
      {expanded && (
        <Text className="mt-2 text-[13px] leading-5 text-slate-500">
          {answer}
        </Text>
      )}
    </Pressable>
  );
}
