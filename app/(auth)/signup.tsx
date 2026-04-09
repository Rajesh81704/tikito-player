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
              Create your account
            </Text>
            <Text className="text-base leading-6 text-slate-600">
              Join Tikito to find grounds faster and keep your game schedule in
              one place.
            </Text>
          </View>

          <View className="gap-[18px] rounded-3xl bg-white p-5 shadow-sm">
            <Text className="text-2xl font-bold text-slate-900">Sign Up</Text>

            <TextField
              label="Full name"
              onChangeText={setFullName}
              placeholder="Enter your full name"
              value={fullName}
            />
            <TextField
              keyboardType="phone-pad"
              label="Phone number"
              onChangeText={setPhoneNo}
              placeholder="9876543210"
              value={phoneNo}
            />
            <TextField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder="you@example.com"
              value={email}
            />
            <TextField
              label="Password"
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              value={password}
            />
            <Button
              loading={signupMutation.isPending}
              onPress={handleSignup}
              title="Create account"
            />

            <View className="flex-row items-center justify-center gap-1.5">
              <Text className="text-sm text-slate-500">
                Already have an account?
              </Text>
              <Link asChild href="/(auth)/login">
                <Pressable>
                  <Text className="text-sm font-bold text-teal-700">Login</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
