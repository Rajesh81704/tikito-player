import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/components/AuthContext';

export default function OtpScreen() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [otp, setOtp] = useState<string[]>(() =>
    Array.from({ length: 6 }, () => ''),
  );
  const indices = [0, 1, 2, 3, 4, 5];

  const inputRefs = useRef<Array<TextInput | null>>(
    Array.from({ length: 6 }, () => null),
  );

  const focus = (idx: number) => {
    inputRefs.current[idx]?.focus();
  };

  const handleChange = (idx: number, text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length === 0) {
      setOtp((prev) => {
        const next = [...prev];
        next[idx] = '';
        return next;
      });
      return;
    }

    const digits = cleaned.slice(0, 6 - idx).split('');
    setOtp((prev) => {
      const next = [...prev];
      digits.forEach((d, offset) => {
        next[idx + offset] = d;
      });
      return next;
    });

    const nextIdx = idx + digits.length;
    if (nextIdx <= 5) {
      focus(nextIdx);
    }
  };

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
              Enter the OTP to continue
            </Text>
          </View>

          <View className="mt-10">
            <View className="flex-row items-center justify-between gap-3">
              {indices.map((idx) => (
                <TextInput
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  value={otp[idx]}
                  onChangeText={(text) => handleChange(idx, text)}
                  onKeyPress={(e) => {
                    if (e.nativeEvent.key !== 'Backspace') return;

                    if (otp[idx] === '' && idx > 0) focus(idx - 1);
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlignVertical="center"
                  textContentType="oneTimeCode"
                  autoCapitalize="none"
                  className="h-14 w-[46px] rounded-2xl border border-gray-200 bg-white text-center text-lg leading-6 font-semibold text-black shadow-sm"
                />
              ))}
            </View>
          </View>

          <Pressable
            onPress={() => {
              setIsLoggedIn(true);
              router.replace('/(tabs)');
            }}
            className="mt-7 w-full items-center justify-center rounded-2xl bg-[#16a34a] py-4 shadow-lg shadow-black/20"
          >
            <Text className="text-base font-semibold text-white">Verify</Text>
          </Pressable>

          <Text className="mt-4 text-center text-[11px] text-gray-400">
            By continuing, you agree to our Terms &amp; Conditions
          </Text>
        </View>
      </View>
    </View>
  );
}
