// API Configuration for Customer App
import { Platform } from 'react-native';
import { useAuthStore } from './stores/authStore';

// Use localhost for web, or your machine's IP for physical devices/Android emulator
// If using Android emulator, use 10.0.2.2 instead of localhost
// If using physical device, replace with your PC's IP address (e.g. 192.168.1.7)
export const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3333' 
  : 'http://192.168.1.7:3333';

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = useAuthStore.getState().token;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-user-role': 'CUSTOMER', // fallback for endpoints that might still use this
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Auto logout on 401
      useAuthStore.getState().logout();
    }
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || 'Something went wrong');
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};
