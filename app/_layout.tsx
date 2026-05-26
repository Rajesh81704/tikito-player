import '../global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/src/context/AuthContext';

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnReconnect: true,
          },
        },
      }),
  );

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="profile/bookings" options={{ title: 'My Bookings' }} />
            <Stack.Screen name="profile/booking-detail" options={{ title: 'Booking Details' }} />
            <Stack.Screen name="turf/[turfId]" options={{ title: 'Turf Details' }} />
            <Stack.Screen
              name="turf/[turfId]/ground/[groundId]"
              options={{ title: 'Slots' }}
            />
            <Stack.Screen
              name="turf/[turfId]/ground/[groundId]/book"
              options={{ title: 'Book' }}
            />
            <Stack.Screen
              name="turf/[turfId]/ground/[groundId]/success"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
          </Stack>
          <StatusBar style="dark" />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
