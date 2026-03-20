import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

export const TabBarIcon = (props: {
  name: ComponentProps<typeof Ionicons>['name'];
  color: string;
}) => {
  return <Ionicons size={28} style={styles.tabBarIcon} {...props} />;
};

export const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});
