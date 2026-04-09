import { Link, Stack } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center p-4 bg-gray-50">
        <Text className="text-2xl font-bold text-gray-900">
          This screen doesn&apos;t exist.
        </Text>
        <Link asChild href="/">
          <Pressable>
            <Text className="text-blue-500">Go to home screen</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
