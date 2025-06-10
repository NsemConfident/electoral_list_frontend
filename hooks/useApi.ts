// hooks/useApi.ts
import { useState, useCallback } from 'react';
import { apiCall } from '../utils/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (endpoint: string, options?: RequestInit) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const response = await apiCall<T>(endpoint, options);
      const data = await response.json();
      
      if (response.ok) {
        setState({ data, loading: false, error: null });
        return { success: true, data };
      } else {
        setState({ data: null, loading: false, error: data.message || 'An error occurred' });
        return { success: false, error: data.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      setState({ data: null, loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  return { ...state, execute };
}