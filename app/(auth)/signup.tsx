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
import { useSignupMutation } from '@/src/hooks/use-auth';
import { loginUser } from '@/src/lib/api';

export default function SignupScreen() {
  const { signIn } = useAuth();
  const signupMutation = useSignupMutation();
  const [fullName, setFullName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (
      !fullName.trim() ||
      !phoneNo.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      Alert.alert('Missing details', 'Please fill in all signup fields.');
      return;
    }

    signupMutation.mutate(
      {
        full_name: fullName.trim(),
        phone_no: phoneNo.trim(),
        email: email.trim(),
        password: password.trim(),
      },
      {
        onSuccess: async (_, variables) => {
          try {
            const authData = await loginUser({
              identifier: variables.email,
              password: variables.password,
              role: 'user',
            });

            await signIn(authData);
            router.replace('/(tabs)');
          } catch (error) {
            Alert.alert(
              'Account created, but login failed',
              error instanceof Error
                ? error.message
                : 'Please log in with your new account.',
            );
          }
        },
        onError: (error) => {
          Alert.alert(
            'Signup failed',
            error instanceof Error ? error.message : 'Please try again.',
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
          <AuthBrandHeader subtitle="Find nearby turfs, book slots instantly, and never miss a game." />
          <View className="w-full">
            <TextField
              label="FULL NAME"
              onChangeText={setFullName}
              placeholder="Enter your full name"
              value={fullName}
              className="mb-5"
            />
            <TextField
              keyboardType="phone-pad"
              label="PHONE NUMBER"
              onChangeText={setPhoneNo}
              placeholder="9876543210"
              value={phoneNo}
              className="mb-5"
            />
            <TextField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              label="EMAIL"
              onChangeText={setEmail}
              placeholder="you@example.com"
              value={email}
              className="mb-5"
            />
            <TextField
              label="PASSWORD"
              onChangeText={setPassword}
              placeholder="Choose a strong password"
              secureTextEntry
              value={password}
            />
            <View className="mt-6">
              <AuthButton
                loading={signupMutation.isPending}
                onPress={handleSignup}
                title="Create account"
              />
            </View>

            <View className="mt-8 flex-row items-center justify-center">
              <Text className="font-medium text-slate-500">
                Already have an account?{' '}
              </Text>
              <Link href="/(auth)/login" asChild>
                <Text className="font-bold text-emerald-600">Login</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
