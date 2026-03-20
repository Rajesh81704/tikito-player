import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  return (
    <View className="flex-1 bg-white px-6">
      <View className="flex-1 items-center justify-center">
        <View className="w-full max-w-[360px]">
          <View className="items-center">
            <View className="rounded-2xl bg-[#16a34a] p-5 shadow-md shadow-black/10">
              <FontAwesome name="soccer-ball-o" size={34} color="white" />
            </View>
            <Text className="mt-6 text-[40px] font-extrabold tracking-tight text-black">
              TurfBook
            </Text>
            <Text className="mt-1 text-center text-base text-gray-500">
              Book sports turfs instantly.
            </Text>
          </View>

          <View className="mt-10">
            <Text className="mb-3 text-sm font-medium text-gray-700">
              Mobile Number
            </Text>

            <View className="flex-row items-center rounded-2xl border border-gray-200 bg-white shadow-sm">
              <View className="w-16 items-center justify-center border-r border-gray-200 py-4">
                <Text className="text-lg font-semibold leading-6 text-gray-800">
                  +91
                </Text>
              </View>

              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                textAlignVertical="center"
                className="flex-1 px-4 py-4 text-lg leading-6 text-black"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
              />
            </View>
          </View>

          <Link href="/(auth)/otp" asChild>
            <Pressable className="mt-7 w-full items-center justify-center rounded-2xl bg-[#16a34a] py-4 shadow-lg shadow-black/20">
              <Text className="text-base font-semibold text-white">
                Login with OTP
              </Text>
            </Pressable>
          </Link>

          <Text className="mt-4 text-center text-[11px] text-gray-400">
            By continuing, you agree to our Terms &amp; Conditions
          </Text>
        </View>
      </View>
    </View>
  );
}
