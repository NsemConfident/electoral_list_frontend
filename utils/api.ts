// utils/api.ts
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://192.168.0.196:8000/api';

interface ApiCallOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiCall = async <T = any>(
  endpoint: string,
  options: ApiCallOptions = {}
): Promise<Response> => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    console.log('API Call URL:', `${API_BASE_URL}${endpoint}`);
    console.log('API Call Config:', config);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', response.headers);

    if (response.status === 401) {
      await SecureStore.deleteItemAsync('authToken');
    }

    return response;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};