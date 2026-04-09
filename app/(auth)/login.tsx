import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { TextField } from '@/src/components/TextField';
import { useAuth } from '@/src/context/AuthContext';
import { useLoginMutation } from '@/src/hooks/use-auth';

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
          } catch (error) {
            Alert.alert(
              'Could not finish login',
              error instanceof Error ? error.message : 'Please try again.',
            );
          }
        },
        onError: (error) => {
          Alert.alert(
            'Login failed',
            error instanceof Error ? error.message : 'Please try again.',
          );
        },
      },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          bounces={false}
          className="flex-1"
          contentContainerClassName="flex-grow justify-center gap-7 px-5 py-7"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-2">
            <Text className="text-[15px] font-bold text-teal-700">Tikito</Text>
            <Text className="text-[34px] font-bold leading-10 text-slate-900">
              Welcome back
            </Text>
            <Text className="text-base leading-6 text-slate-600">
              Sign in to discover turfs, manage bookings, and keep playing.
            </Text>
          </View>

          <View className="gap-[18px] rounded-3xl bg-white p-5 shadow-sm">
            <Text className="text-2xl font-bold text-slate-900">Login</Text>

            <TextField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              label="Email"
              onChangeText={setIdentifier}
              placeholder="you@example.com"
              value={identifier}
            />
            <TextField
              label="Password"
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
            />
            <Button
              loading={loginMutation.isPending}
              onPress={handleLogin}
              title="Login"
            />

            <View className="flex-row items-center justify-center gap-1.5">
              <Text className="text-sm text-slate-500">
                Don&apos;t have an account?
              </Text>
              <Link asChild href="/(auth)/signup">
                <Pressable>
                  <Text className="text-sm font-bold text-teal-700">
                    Sign up
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
