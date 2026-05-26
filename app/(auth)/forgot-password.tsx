import { router } from 'expo-router';
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

import { AuthBrandHeader } from '@/src/components/AuthBrandHeader';
import { AuthButton } from '@/src/components/AuthButton';
import { TextField } from '@/src/components/TextField';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from '@/src/hooks/use-auth';

type Step = 'email' | 'otp' | 'reset';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const forgotMutation = useForgotPasswordMutation();
  const verifyMutation = useVerifyOtpMutation();
  const resetMutation = useResetPasswordMutation();

  const handleSendOtp = () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Please enter your registered email.');
      return;
    }

    forgotMutation.mutate(
      { email: email.trim().toLowerCase(), role: 'user' },
      {
        onSuccess: () => {
          setStep('otp');
        },
        onError: (error) => {
          Alert.alert(
            'Error',
            error instanceof Error ? error.message : 'Please try again.',
          );
        },
      },
    );
  };

  const handleVerifyOtp = () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      Alert.alert('Invalid code', 'Please enter the 6-digit code.');
      return;
    }

    verifyMutation.mutate(
      { email: email.trim().toLowerCase(), otp: otp.trim() },
      {
        onSuccess: () => {
          setStep('reset');
        },
        onError: (error) => {
          Alert.alert(
            'Verification failed',
            error instanceof Error ? error.message : 'Please try again.',
          );
        },
      },
    );
  };

  const handleResetPassword = () => {
    if (!newPassword.trim()) {
      Alert.alert('Missing password', 'Please enter a new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Too short', 'Password must be at least 6 characters.');
      return;
    }

    resetMutation.mutate(
      { email: email.trim().toLowerCase(), new_password: newPassword },
      {
        onSuccess: () => {
          Alert.alert(
            'Password reset',
            'Your password has been changed. Please login with your new password.',
            [{ text: 'Login', onPress: () => router.replace('/(auth)/login') }],
          );
        },
        onError: (error) => {
          Alert.alert(
            'Reset failed',
            error instanceof Error ? error.message : 'Please try again.',
          );
        },
      },
    );
  };

  const subtitles: Record<Step, string> = {
    email: "Enter your email and we'll send you a reset code.",
    otp: `We sent a 6-digit code to ${email}. Enter it below.`,
    reset: 'Choose a new password for your account.',
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
          <AuthBrandHeader subtitle={subtitles[step]} />

          {/* Step indicator */}
          <View className="mb-8 flex-row gap-2">
            {(['email', 'otp', 'reset'] as Step[]).map((s, i) => (
              <View
                key={s}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= ['email', 'otp', 'reset'].indexOf(step)
                    ? 'bg-emerald-500'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </View>

          <View className="w-full">
            {step === 'email' && (
              <>
                <TextField
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  label="EMAIL"
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  value={email}
                />
                <View className="mt-6">
                  <AuthButton
                    loading={forgotMutation.isPending}
                    onPress={handleSendOtp}
                    title="Send Reset Code"
                  />
                </View>
              </>
            )}

            {step === 'otp' && (
              <>
                <TextField
                  keyboardType="number-pad"
                  label="VERIFICATION CODE"
                  maxLength={6}
                  onChangeText={setOtp}
                  placeholder="123456"
                  value={otp}
                />
                <View className="mt-6">
                  <AuthButton
                    loading={verifyMutation.isPending}
                    onPress={handleVerifyOtp}
                    title="Verify Code"
                  />
                </View>
                <Pressable
                  className="mt-4 items-center"
                  onPress={() => {
                    setOtp('');
                    handleSendOtp();
                  }}
                  disabled={forgotMutation.isPending}
                >
                  <Text className="text-sm font-semibold text-emerald-600">
                    Resend code
                  </Text>
                </Pressable>
              </>
            )}

            {step === 'reset' && (
              <>
                <TextField
                  label="NEW PASSWORD"
                  onChangeText={setNewPassword}
                  placeholder="Choose a strong password"
                  secureTextEntry
                  value={newPassword}
                />
                <TextField
                  label="CONFIRM PASSWORD"
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter your password"
                  secureTextEntry
                  value={confirmPassword}
                />
                <View className="mt-6">
                  <AuthButton
                    loading={resetMutation.isPending}
                    onPress={handleResetPassword}
                    title="Reset Password"
                  />
                </View>
              </>
            )}

            <Pressable
              className="mt-8 items-center"
              onPress={() => router.back()}
            >
              <Text className="text-sm font-semibold text-slate-500">
                ← Back to Login
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
