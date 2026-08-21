export const API_URL = 'http://localhost:3333';
export const CURRENT_USER_ID = '9999999999'; // Assuming admin

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': CURRENT_USER_ID,
    'x-user-role': 'ADMIN',
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
