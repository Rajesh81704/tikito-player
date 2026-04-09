import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';

import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { useAuth } from '@/src/context/AuthContext';

export default function TabsLayout() {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return <FullScreenLoader label="Loading your player app..." />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: '#F8FAFC',
        },
        tabBarActiveTintColor: '#0F766E',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 82,
          paddingTop: 10,
          paddingBottom: 18,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? 'home' : 'home-outline'}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? 'compass' : 'compass-outline'}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              color={color}
              name={focused ? 'person' : 'person-outline'}
              size={22}
            />
          ),
        }}
      />
    </Tabs>
  );
}
