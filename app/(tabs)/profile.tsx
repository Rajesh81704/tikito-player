import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/components/AuthContext';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TurfCard } from '@/components/ui/TurfCard';
import type { Turf } from '@/data/turf';
import { useTurfList } from '@/hooks/useTurf';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const FAVORITE_IDS = ['turf-1', 'turf-3'] as const;

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <View className="flex-1 rounded-2xl bg-gray-50 border border-gray-100 p-3">
      <Text className="text-sm font-semibold text-gray-600">{label}</Text>
      <Text className="mt-1 text-2xl font-extrabold text-gray-900">
        {value}
      </Text>
      {hint ? (
        <Text className="mt-1 text-xs font-semibold text-gray-500">{hint}</Text>
      ) : null}
    </View>
  );
}

function ActionTile({
  title,
  subtitle,
  icon,
  iconBg = 'bg-green-50',
  iconColor = '#16a34a',
  onPress,
  danger,
}: {
  title: string;
  subtitle?: string;
  icon: IoniconName;
  iconBg?: string;
  iconColor?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={[
        'w-[48%] rounded-2xl bg-white shadow-sm border',
        danger ? 'border-red-100' : 'border-gray-100',
        'px-4 py-4',
      ].join(' ')}
    >
      <View className="flex-row items-center gap-3">
        <View
          className={[
            'rounded-xl p-2 items-center justify-center',
            danger ? 'bg-red-50' : iconBg,
          ].join(' ')}
        >
          <Ionicons
            name={icon}
            size={20}
            color={danger ? '#dc2626' : iconColor}
          />
        </View>
        <View className="flex-1">
          <Text
            className={[
              'text-sm font-bold',
              danger ? 'text-red-700' : 'text-gray-900',
            ].join(' ')}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              className={[
                'mt-0.5 text-xs font-semibold',
                danger ? 'text-red-400' : 'text-gray-500',
              ].join(' ')}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={danger ? '#dc2626' : '#9ca3af'}
        />
      </View>
    </Pressable>
  );
}

export default function Profile() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const { data, isLoading, refetch } = useTurfList();
  const turfs = data ?? [];

  const favoriteTurfs = useMemo(() => {
    const set = new Set(FAVORITE_IDS as unknown as string[]);
    return turfs.filter((t) => set.has(t.id));
  }, [turfs]);

  const recommended = useMemo(() => {
    // Prefer nearby turfs, but fall back to overall best rated.
    const nearby = turfs.filter((t) => t.isNearby);
    const base = (nearby.length ? nearby : turfs).slice();
    return base.sort((a, b) => b.rating - a.rating).slice(0, 4) as Turf[];
  }, [turfs]);

  function handleAction(
    action:
      | 'saved'
      | 'bookings'
      | 'settings'
      | 'payments'
      | 'create'
      | 'offers'
      | 'logout',
  ) {
    switch (action) {
      case 'saved':
        router.push('/favorites');
        return;
      case 'bookings':
        Alert.alert(
          'Coming soon',
          'Booking history will be available in a future update.',
        );
        return;
      case 'create':
        router.push('/discover');
        return;
      case 'offers':
        router.push('/discover');
        return;
      case 'settings':
        Alert.alert('Coming soon', 'Settings screen is not wired up yet.');
        return;
      case 'payments':
        Alert.alert('Coming soon', 'Payments screen is not wired up yet.');
        return;
      case 'logout':
        setIsLoggedIn(false);
        router.replace('/(auth)');
        return;
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="px-4 pb-28 pt-2">
        <Text className="text-2xl font-extrabold text-gray-900">
          My Profile
        </Text>

        {/* Header */}
        <View className="mt-4 flex-row items-center justify-between rounded-2xl bg-gray-50 border border-gray-100 px-4 py-4">
          <View className="flex-row items-center gap-3">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-green-200">
              <Text className="text-2xl font-extrabold text-green-700">A</Text>
            </View>

            <View>
              <Text className="text-lg font-extrabold text-gray-900">Amit</Text>
              <View className="mt-1 flex-row items-center gap-1.5">
                <Ionicons name="pin" size={14} color="#16a34a" />
                <Text className="text-sm font-semibold text-gray-600">
                  Indiranagar
                </Text>
              </View>
              <Text className="mt-1 text-xs font-medium text-gray-400">
                Player profile
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              Alert.alert('Coming soon', 'Profile editing is not wired up yet.')
            }
            className="rounded-xl bg-gray-100 px-3 py-2"
          >
            <Ionicons name="create-outline" size={18} color="#16a34a" />
          </Pressable>
        </View>

        {/* Stats */}
        <View className="mt-4 flex-row gap-3">
          <StatCard label="Bookings" value="12" hint="This month" />
          <StatCard
            label="Saved"
            value={String(favoriteTurfs.length)}
            hint="Turfs"
          />
          <StatCard label="Rating" value="4.7" hint="Avg." />
        </View>

        {/* Quick actions */}
        <View className="mt-5">
          <SectionHeader title="Quick Actions" />

          <View className="flex-row flex-wrap justify-between gap-y-3">
            <ActionTile
              title="Saved Turfs"
              subtitle="Your favorites"
              icon={'heart-outline' as unknown as IoniconName}
              onPress={() => handleAction('saved')}
            />
            <ActionTile
              title="My Bookings"
              subtitle="History & invoices"
              icon={'calendar-outline' as unknown as IoniconName}
              iconBg="bg-gray-50"
              iconColor="#6b7280"
              onPress={() => handleAction('bookings')}
            />
            <ActionTile
              title="Create Activity"
              subtitle="Invite players"
              icon={'add-circle-outline' as unknown as IoniconName}
              onPress={() => handleAction('create')}
            />
            <ActionTile
              title="Offers"
              subtitle="Best deals"
              icon={'pricetags-outline' as unknown as IoniconName}
              iconBg="bg-emerald-50"
              iconColor="#059669"
              onPress={() => handleAction('offers')}
            />
          </View>
        </View>

        {/* Saved turfs */}
        <View className="mt-6">
          <SectionHeader
            title="Saved Turfs"
            actionText={
              isLoading
                ? undefined
                : favoriteTurfs.length
                  ? 'See all'
                  : undefined
            }
            onActionPress={() => handleAction('saved')}
          />

          {isLoading ? (
            <Text className="text-sm text-gray-500">Loading your turfs...</Text>
          ) : favoriteTurfs.length === 0 ? (
            <View className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <View className="h-12 w-12 rounded-2xl bg-green-50 items-center justify-center border border-green-100">
                <Ionicons name="heart-outline" size={22} color="#16a34a" />
              </View>
              <Text className="mt-3 text-base font-extrabold text-gray-900">
                No saved turfs yet
              </Text>
              <Text className="mt-1 text-sm font-semibold text-gray-500">
                Browse Discover and save venues you like.
              </Text>

              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/discover')}
                className="mt-4 w-full rounded-2xl bg-green-500 px-4 py-3 items-center shadow-sm"
              >
                <Text className="text-sm font-extrabold text-white">
                  Explore Turfs
                </Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3"
            >
              {favoriteTurfs.map((t) => (
                <View key={t.id} className="w-44">
                  <TurfCard
                    turf={t}
                    size="compact"
                    onPress={() => router.push(`/details?id=${t.id}`)}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Recommended */}
        <View className="mt-6">
          <SectionHeader
            title="Recommended for you"
            actionText={isLoading ? undefined : 'Refresh'}
            onActionPress={() => {
              void refetch();
            }}
          />

          {isLoading ? (
            <Text className="text-sm text-gray-500">Picking top turfs...</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3"
            >
              {recommended.map((t) => (
                <View key={t.id} className="w-44">
                  <TurfCard
                    turf={t}
                    size="compact"
                    onPress={() => router.push(`/details?id=${t.id}`)}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Account */}
        <View className="mt-6">
          <SectionHeader title="Account" />

          <View className="flex-row flex-wrap justify-between gap-y-3">
            <ActionTile
              title="Settings"
              subtitle="Preferences"
              icon={'settings-outline' as unknown as IoniconName}
              iconBg="bg-gray-50"
              iconColor="#6b7280"
              onPress={() => handleAction('settings')}
            />
            <ActionTile
              title="Payments"
              subtitle="Saved methods"
              icon={'card-outline' as unknown as IoniconName}
              iconBg="bg-gray-50"
              iconColor="#6b7280"
              onPress={() => handleAction('payments')}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => handleAction('logout')}
            className="mt-4 w-full rounded-2xl bg-red-50 border border-red-100 px-4 py-4 items-center shadow-sm"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="log-out-outline" size={20} color="#dc2626" />
              <Text className="text-sm font-extrabold text-red-700">
                Logout
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
