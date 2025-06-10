// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthContextType, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { apiCall } from '@/utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        const response = await apiCall<User>('/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token is invalid, remove it
          await SecureStore.deleteItemAsync('authToken');
        }
      }
    } catch (error) {
      console.error('Auth loading error:', error);
      await SecureStore.deleteItemAsync('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      await SecureStore.setItemAsync('authToken', data.data.access_token);
      setUser(data.data.user);
      return { success: true };
    }
    
    return { success: false, error: data.message || 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error occurred' };
  }
};

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
  console.log('register data', data);
  try {
    console.log('register data 2', JSON.stringify(data));
    
    const response = await apiCall<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    console.log('register response status:', response.status);
    console.log('register response ok:', response.ok);
    
    const responseData = await response.json();
    console.log('register response data:', responseData);
    
    if (response.ok && responseData.success) {
      // Use access_token from the nested data object
      await SecureStore.setItemAsync('authToken', responseData.data.access_token);
      setUser(responseData.data.user);
      return { success: true };
    }
    
    // Handle validation errors
    if (response.status === 422 && responseData.errors) {
      const errorMessages = Object.values(responseData.errors).flat().join(', ');
      return { success: false, error: errorMessages };
    }
    
    return { success: false, error: responseData.message || 'Registration failed' };
  } catch (error) {
    console.error('Registration error details:', error);
    return { success: false, error: `Network error: ${error.message}` };
  }
};


  const logout = async (): Promise<void> => {
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await SecureStore.deleteItemAsync('authToken');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};