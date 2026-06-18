import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBrandHeader } from '@/src/components/AuthBrandHeader';
import { AuthButton } from '@/src/components/AuthButton';
import { TextField } from '@/src/components/TextField';
import { useForgotPasswordMutation, useResetPasswordMutation, useVerifyOtpMutation } from '@/src/hooks/use-auth';
import { C, radius } from '@/src/lib/theme';

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

  const steps: Step[] = ['email', 'otp', 'reset'];
  const subtitles: Record<Step, string> = {
    email: "Enter your email and we'll send you a reset code.",
    otp: `We sent a 6-digit code to ${email}.`,
    reset: 'Choose a new password for your account.',
  };

  const handleSendOtp = () => {
    if (!email.trim()) { Alert.alert('Missing email', 'Please enter your registered email.'); return; }
    forgotMutation.mutate({ email: email.trim().toLowerCase(), role: 'user' }, {
      onSuccess: () => setStep('otp'),
      onError: (err) => Alert.alert('Error', err instanceof Error ? err.message : 'Please try again.'),
    });
  };

  const handleVerifyOtp = () => {
    if (!otp.trim() || otp.trim().length !== 6) { Alert.alert('Invalid code', 'Enter the 6-digit code.'); return; }
    verifyMutation.mutate({ email: email.trim().toLowerCase(), otp: otp.trim() }, {
      onSuccess: () => setStep('reset'),
      onError: (err) => Alert.alert('Verification failed', err instanceof Error ? err.message : 'Please try again.'),
    });
  };

  const handleReset = () => {
    if (!newPassword.trim()) { Alert.alert('Missing password', 'Enter a new password.'); return; }
    if (newPassword !== confirmPassword) { Alert.alert('Mismatch', 'Passwords do not match.'); return; }
    if (newPassword.length < 6) { Alert.alert('Too short', 'Password must be at least 6 characters.'); return; }
    resetMutation.mutate({ email: email.trim().toLowerCase(), new_password: newPassword }, {
      onSuccess: () => Alert.alert('Password reset', 'Login with your new password.', [{ text: 'Login', onPress: () => router.replace('/(auth)/login') }]),
      onError: (err) => Alert.alert('Reset failed', err instanceof Error ? err.message : 'Please try again.'),
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 56 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <AuthBrandHeader subtitle={subtitles[step]} />

          {/* Step indicator */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 28 }}>
            {steps.map((s, i) => (
              <View key={s} style={{ flex: 1, height: 3, borderRadius: radius.full, backgroundColor: i <= steps.indexOf(step) ? C.gold : C.border }} />
            ))}
          </View>

          {step === 'email' && (
            <>
              <TextField autoCapitalize="none" keyboardType="email-address" label="EMAIL" onChangeText={setEmail} placeholder="you@example.com" value={email} />
              <View style={{ marginTop: 8 }}>
                <AuthButton loading={forgotMutation.isPending} onPress={handleSendOtp} title="Send Reset Code" />
              </View>
            </>
          )}
          {step === 'otp' && (
            <>
              <TextField keyboardType="number-pad" label="VERIFICATION CODE" maxLength={6} onChangeText={setOtp} placeholder="123456" value={otp} />
              <View style={{ marginTop: 8 }}>
                <AuthButton loading={verifyMutation.isPending} onPress={handleVerifyOtp} title="Verify Code" />
              </View>
              <Pressable style={{ marginTop: 16, alignItems: 'center' }} onPress={() => { setOtp(''); handleSendOtp(); }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.gold, fontFamily: C.sans }}>Resend code</Text>
              </Pressable>
            </>
          )}
          {step === 'reset' && (
            <>
              <TextField label="NEW PASSWORD" onChangeText={setNewPassword} placeholder="Choose a strong password" secureTextEntry value={newPassword} />
              <TextField label="CONFIRM PASSWORD" onChangeText={setConfirmPassword} placeholder="Re-enter password" secureTextEntry value={confirmPassword} />
              <View style={{ marginTop: 8 }}>
                <AuthButton loading={resetMutation.isPending} onPress={handleReset} title="Reset Password" />
              </View>
            </>
          )}

          <Pressable style={{ marginTop: 32, alignItems: 'center' }} onPress={() => router.back()}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMuted, fontFamily: C.sans }}>← Back to Login</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
