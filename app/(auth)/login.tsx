'use client';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, Image, KeyboardAvoidingView, Linking, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthButton } from '@/src/components/AuthButton';
import { TextField } from '@/src/components/TextField';
import { useAuth } from '@/src/context/AuthContext';
import { useLoginMutation } from '@/src/hooks/use-auth';
import { C, radius } from '@/src/lib/theme';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { signIn } = useAuth();
  const loginMutation = useLoginMutation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Enter your email and password to continue.');
      return;
    }
    loginMutation.mutate(
      { identifier: identifier.trim(), password: password.trim(), role: 'user' },
      {
        onSuccess: async (data) => {
          try { await signIn(data); router.replace('/(tabs)'); }
          catch { Alert.alert('Error', 'Could not complete sign in.'); }
        },
        onError: (err) => Alert.alert('Login Failed', err instanceof Error ? err.message : 'Try again.'),
      }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <View style={{ position: 'relative', height: 300 }}>
            <Image source={require('@/assets/images/hero.png')} style={{ width, height: 300 }} resizeMode="cover" />
            <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)' }} />
            <SafeAreaView style={{ position: 'absolute', inset: 0, justifyContent: 'flex-end', paddingHorizontal: 28, paddingBottom: 28 }}>
              <Text style={{ fontSize: 42, fontWeight: '800', color: C.gold, fontFamily: C.serif, letterSpacing: -1 }}>
                Tikito.
              </Text>
              <Text style={{ marginTop: 6, fontSize: 15, color: 'rgba(245,240,232,0.75)', fontFamily: C.sans }}>
                Book turfs. Play games. Win matches.
              </Text>
            </SafeAreaView>
          </View>

          {/* Form */}
          <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 }}>
            <Text style={{ fontSize: 26, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif, letterSpacing: -0.3 }}>
              Welcome back
            </Text>
            <Text style={{ marginTop: 6, marginBottom: 28, fontSize: 14, color: C.textSecondary, fontFamily: C.sans }}>
              Sign in to continue to your account
            </Text>

            <TextField autoCapitalize="none" keyboardType="email-address" label="EMAIL OR PHONE" onChangeText={setIdentifier} placeholder="you@example.com" value={identifier} />
            <TextField label="PASSWORD" onChangeText={setPassword} placeholder="Your password" secureTextEntry value={password} />

            <View style={{ marginTop: 8 }}>
              <AuthButton loading={loginMutation.isPending} onPress={handleLogin} title="Sign In" />
            </View>

            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: C.textSecondary, fontFamily: C.sans, fontSize: 14 }}>Forgot your password? </Text>
              <Link href="/(auth)/forgot-password" asChild>
                <Text style={{ fontWeight: '700', color: C.gold, fontFamily: C.sans, fontSize: 14 }}>Reset it</Text>
              </Link>
            </View>

            <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: C.textSecondary, fontFamily: C.sans, fontSize: 14 }}>New here? </Text>
              <Link href="/(auth)/signup" asChild>
                <Text style={{ fontWeight: '700', color: C.gold, fontFamily: C.sans, fontSize: 14 }}>Create account</Text>
              </Link>
            </View>

            <View style={{ marginTop: 32, paddingBottom: 16 }}>
              <Text style={{ textAlign: 'center', color: C.textSecondary, fontFamily: C.sans, fontSize: 12 }}>
                By proceeding, you agree to our{' '}
                <Text style={{ color: C.gold, textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://tikitoapp.netlify.app/privacy-policy')}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
