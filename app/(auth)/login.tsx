import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBrandHeader } from '@/src/components/AuthBrandHeader';
import { AuthButton } from '@/src/components/AuthButton';
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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 60,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthBrandHeader subtitle="Book turfs, manage your games, and get on the field faster." />

          {/* Form Container */}
          <View className="w-full">
            <TextField
              autoCapitalize="none"
              keyboardType="email-address"
              label="EMAIL"
              onChangeText={setIdentifier}
              value={identifier}
              className="mb-5"
            />
            <TextField
              label="PASSWORD"
              onChangeText={setPassword}
              secureTextEntry
              value={password}
            />

            <View className="mt-6">
              <AuthButton
                loading={loginMutation.isPending}
                onPress={handleLogin}
                title="Login"
              />
            </View>

            <View className="mt-8 flex-row items-center justify-center">
              <Text className="text-slate-500 font-medium">New here? </Text>
              <Link href="/(auth)/signup" asChild>
                <Text className="font-bold text-emerald-600">
                  Create an account
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
