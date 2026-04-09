import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';

export default function ProfileScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Profile Header with Initials */}
        <View className="items-center px-4 py-5">
          {/* Initials Avatar Container */}
          <View className="h-28 w-28 items-center justify-center rounded-full border-2 border-white bg-emerald-100 shadow-sm">
            <Text
              className="text-center text-4xl font-black tracking-tighter text-emerald-800 leading-none"
              style={{ includeFontPadding: false }}
            >
              VN
            </Text>
          </View>

          <Text className="mt-6 text-3xl font-black tracking-tight text-slate-900">
            Vivek Nair
          </Text>

          <View className="mt-2 items-center">
            <Text className="text-slate-500 text-base font-medium">
              viveknair@gmail.com
            </Text>
            <Text className="text-slate-400 text-sm mt-0.5">
              +91 9876543210
            </Text>
          </View>

          <View className="mt-4 flex-row items-center bg-emerald-50 px-4 py-1.5 rounded-full">
            <Ionicons name="location-sharp" size={14} color="#059669" />
            <Text className="ml-1.5 text-xs font-bold text-emerald-700">
              Gurgaon, Haryana
            </Text>
          </View>
        </View>

        {/* Menu Options */}
        <View className="px-4 gap-3">
          <OptionButton
            title="My Bookings"
            onPress={() => router.push('/profile/bookings')}
            icon="calendar"
            color="#059669"
          />

          <OptionButton
            title="Delete My Account"
            onPress={() => Alert.alert('Coming Soon.')}
            icon="trash"
            color="#ef4444"
          />

          <View className="mt-4">
            <Pressable
              onPress={handleLogout}
              className="flex-row items-center justify-center h-14 rounded-2xl bg-slate-900 shadow-sm"
              style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
            >
              <Ionicons name="log-out" size={20} color="white" />
              <Text className="ml-2 text-base font-bold text-white">
                Logout
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OptionButton({
  title,
  onPress,
  icon,
  color,
}: {
  title: string;
  onPress: () => void;
  icon: ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#f8fafc' : '#f1f5f9',
      })}
      className="flex-row items-center h-16 px-4 rounded-2xl bg-[#f1f5f9]"
    >
      <View
        style={{ backgroundColor: 'white' }}
        className="h-10 w-10 rounded-xl items-center justify-center shadow-sm"
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>

      <Text className="flex-1 ml-4 text-base font-bold text-slate-800">
        {title}
      </Text>

      <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
    </Pressable>
  );
}
