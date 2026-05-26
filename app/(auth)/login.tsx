import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/src/components/AuthButton';
import { TextField } from '@/src/components/TextField';
import { useAuth } from '@/src/context/AuthContext';
import { useLoginMutation } from '@/src/hooks/use-auth';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { signIn } = useAuth();
  const loginMutation = useLoginMutation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert(
        'Missing details',
        'Enter your email and password to continue.',
      );
      return;
    }

    loginMutation.mutate(
      {
        identifier: identifier.trim(),
        password: password.trim(),
        role: 'user',
      },
      {
        onSuccess: async (data) => {
          try {
            await signIn(data);
            router.replace('/(tabs)');
          } catch {
            Alert.alert('Error', 'Could not complete sign in.');
          }
        },
        onError: (error) => {
          Alert.alert(
            'Login Failed',
            error instanceof Error ? error.message : 'Try again.',
          );
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image Section */}
          <View className="relative" style={{ height: 280 }}>
            <Image
              source={require('@/assets/images/hero.png')}
              style={{ width, height: 280 }}
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/30" />
            <SafeAreaView className="absolute inset-0 justify-end px-6 pb-6">
              <Text className="text-4xl font-black tracking-tighter text-white">
                Tikito.
              </Text>
              <Text className="mt-1 text-base font-medium text-white/80">
                Book turfs. Play games. Win matches.
              </Text>
            </SafeAreaView>
          </View>

          {/* Form Section */}
          <View className="flex-1 px-6 pt-8 pb-6">
            <Text className="text-2xl font-black tracking-tight text-slate-900">
              Welcome back
            </Text>
            <Text className="mt-1 text-sm font-medium text-slate-500">
              Sign in to continue to your account
            </Text>

            <View className="mt-8 w-full">
              <TextField
                autoCapitalize="none"
                keyboardType="email-address"
                label="EMAIL OR PHONE"
                onChangeText={setIdentifier}
                placeholder="you@example.com"
                value={identifier}
              />
              <TextField
                label="PASSWORD"
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
              />

              <View className="mt-2">
                <AuthButton
                  loading={loginMutation.isPending}
                  onPress={handleLogin}
                  title="Sign In"
                />
              </View>

              <View className="mt-6 flex-row items-center justify-center">
                <Text className="text-slate-500 font-medium">
                  Forgot your password?{' '}
                </Text>
                <Link href="/(auth)/forgot-password" asChild>
                  <Text className="font-bold text-emerald-600">Reset it</Text>
                </Link>
              </View>

              <View className="mt-3 flex-row items-center justify-center">
                <Text className="text-slate-500 font-medium">New here? </Text>
                <Link href="/(auth)/signup" asChild>
                  <Text className="font-bold text-emerald-600">
                    Create an account
                  </Text>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
