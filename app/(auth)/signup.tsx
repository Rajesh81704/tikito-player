import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBrandHeader } from '@/src/components/AuthBrandHeader';
import { AuthButton } from '@/src/components/AuthButton';
import { TextField } from '@/src/components/TextField';
import { useAuth } from '@/src/context/AuthContext';
import { useSignupMutation } from '@/src/hooks/use-auth';
import { loginUser } from '@/src/lib/api';
import { C } from '@/src/lib/theme';

export default function SignupScreen() {
  const { signIn } = useAuth();
  const signupMutation = useSignupMutation();
  const [fullName, setFullName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (!fullName.trim() || !phoneNo.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Please fill in all fields.');
      return;
    }
    signupMutation.mutate(
      { full_name: fullName.trim(), phone_no: phoneNo.trim(), email: email.trim(), password: password.trim() },
      {
        onSuccess: async (_, vars) => {
          try {
            const auth = await loginUser({ identifier: vars.email, password: vars.password, role: 'user' });
            await signIn(auth);
            router.replace('/(tabs)');
          } catch (err) {
            Alert.alert('Account created', err instanceof Error ? err.message : 'Please log in.');
          }
        },
        onError: (err) => Alert.alert('Signup failed', err instanceof Error ? err.message : 'Please try again.'),
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 56 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <AuthBrandHeader subtitle="Find turfs, book slots instantly, never miss a game." />
          <TextField label="FULL NAME" onChangeText={setFullName} placeholder="Your full name" value={fullName} />
          <TextField keyboardType="phone-pad" label="PHONE NUMBER" onChangeText={setPhoneNo} placeholder="9876543210" value={phoneNo} />
          <TextField autoCapitalize="none" keyboardType="email-address" label="EMAIL" onChangeText={setEmail} placeholder="you@example.com" value={email} />
          <TextField label="PASSWORD" onChangeText={setPassword} placeholder="Choose a strong password" secureTextEntry value={password} />
          <View style={{ marginTop: 8 }}>
            <AuthButton loading={signupMutation.isPending} onPress={handleSignup} title="Create Account" />
          </View>
          <View style={{ marginTop: 28, flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: C.textSecondary, fontFamily: C.sans, fontSize: 14 }}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Text style={{ fontWeight: '700', color: C.gold, fontFamily: C.sans, fontSize: 14 }}>Login</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
