import { Platform } from 'react-native';

export const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3333' 
  : 'http://192.168.1.7:3333';

export const CURRENT_USER_ID = 'delivery-partner-123';

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': CURRENT_USER_ID,
    'x-user-role': 'DELIVERY_PARTNER',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || 'Something went wrong');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};
