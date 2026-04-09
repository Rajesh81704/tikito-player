import { router } from 'expo-router';
import { Alert, Text, View } from 'react-native';

import { Button } from '@/src/components/Button';
import { useAuth } from '@/src/context/AuthContext';

export default function ProfileScreen() {
  const { logout, user } = useAuth();

  const handleMyBookings = () => {
    router.push('/profile/bookings');
  };

  const handleDeleteMyAccount = () => {
    Alert.alert('Coming Soon.');
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert(
        'Logout failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  };

  return (
    <View className="flex-1 px-5 py-5">
      <View className="gap-4 rounded-3xl bg-white p-5">
        <Text className="text-3xl font-bold text-slate-900">Profile</Text>
        <Text className="text-[15px] text-slate-600">
          Signed in as role: {user?.role ?? 'user'}
        </Text>
        <Button
          onPress={handleMyBookings}
          title="My Bookings"
          variant="secondary"
        />
        <Button
          onPress={handleDeleteMyAccount}
          title="Delete My Account"
          variant="secondary"
        />
        <Button onPress={handleLogout} title="Logout" variant="secondary" />
      </View>
    </View>
  );
}
