import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'hedaktuk_user_token';
const USER_KEY = 'hedaktuk_user_data';

export interface User {
  id: string;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true, // true by default until checkAuth completes

  login: async (token: string, user: User) => {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      set({ token, user });
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  },

  logout: async () => {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
      set({ token: null, user: null });
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  },

  checkAuth: async () => {
    try {
      let token = null;
      let userStr = null;

      if (Platform.OS !== 'web') {
        token = await SecureStore.getItemAsync(TOKEN_KEY);
        userStr = await SecureStore.getItemAsync(USER_KEY);
      } else {
        token = localStorage.getItem(TOKEN_KEY);
        userStr = localStorage.getItem(USER_KEY);
      }

      if (token && userStr) {
        set({ token, user: JSON.parse(userStr), isLoading: false });
      } else {
        set({ token: null, user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      set({ token: null, user: null, isLoading: false });
    }
  },
}));
