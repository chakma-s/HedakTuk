import { create } from 'zustand';
import { useColorScheme } from 'react-native';
import { LightColors, DarkColors, ThemeColors } from '../constants/theme';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark', // default
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'dark' ? 'light' : 'dark' 
  })),
}));

export function useTheme(): ThemeColors {
  const { theme } = useThemeStore();
  const systemTheme = useColorScheme();
  
  const activeTheme = theme === 'system' ? (systemTheme || 'light') : theme;
  return activeTheme === 'dark' ? DarkColors : LightColors;
}

export function useIsDark(): boolean {
  const { theme } = useThemeStore();
  const systemTheme = useColorScheme();
  
  const activeTheme = theme === 'system' ? (systemTheme || 'light') : theme;
  return activeTheme === 'dark';
}
