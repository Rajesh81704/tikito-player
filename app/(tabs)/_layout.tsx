import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { useAuth } from '@/src/context/AuthContext';
import { C } from '@/src/lib/theme';

export default function TabsLayout() {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return <FullScreenLoader label="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        sceneStyle: { backgroundColor: C.bg },
        tabBarActiveTintColor: C.gold,
        tabBarInactiveTintColor: C.textMuted,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          backgroundColor: C.card,
          borderTopColor: C.border,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: C.sans,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons color={color} name={focused ? 'home' : 'home-outline'} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          headerStyle: { backgroundColor: C.card },
          headerTitleStyle: { color: C.textPrimary, fontFamily: C.serif, fontSize: 18 },
          headerShadowVisible: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons color={color} name={focused ? 'compass' : 'compass-outline'} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerStyle: { backgroundColor: C.card },
          headerTitleStyle: { color: C.textPrimary, fontFamily: C.serif, fontSize: 18 },
          headerShadowVisible: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons color={color} name={focused ? 'person' : 'person-outline'} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
