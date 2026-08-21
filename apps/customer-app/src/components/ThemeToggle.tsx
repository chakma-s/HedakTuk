import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore, useTheme, useIsDark } from '../stores/themeStore';

export default function ThemeToggle() {
  const { toggleTheme } = useThemeStore();
  const Colors = useTheme();
  const isDark = useIsDark();

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.container}>
      <Ionicons
        name="contrast-outline"
        size={24}
        color={Colors.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
