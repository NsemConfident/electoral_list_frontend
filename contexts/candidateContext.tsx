// contexts/CandidateContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  PresidentialCandidate, 
  CandidateContextType, 
  CandidatesListResponse,
  CreateCandidateData,
  UpdateCandidateData,
  ApiResponse 
} from '../types/candidate';
import { apiCall } from '@/utils/api';

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

interface CandidateProviderProps {
  children: ReactNode;
}

export function CandidateProvider({ children }: CandidateProviderProps) {
  const [candidates, setCandidates] = useState<PresidentialCandidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall<CandidatesListResponse>('/auth/candidates');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setCandidates(data.data);
        return { success: true };
      } else {
        const errorMessage = data.message || 'Failed to fetch candidates';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Fetch candidates error:', error);
      const errorMessage = 'Network error occurred while fetching candidates';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const createCandidate = async (candidateData: CreateCandidateData): Promise<{ success: boolean; error?: string; data?: PresidentialCandidate }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Creating candidate:', candidateData);
      
      const response = await apiCall<ApiResponse<PresidentialCandidate>>('/presidential-candidates', {
        method: 'POST',
        body: JSON.stringify(candidateData),
      });
      
      console.log('Create candidate response status:', response.status);
      console.log('Create candidate response ok:', response.ok);
      
      const responseData = await response.json();
      console.log('Create candidate response data:', responseData);
      
      if (response.ok && responseData.success) {
        const newCandidate = responseData.data;
        setCandidates(prev => [...prev, newCandidate]);
        return { success: true, data: newCandidate };
      }
      
      // Handle validation errors
      if (response.status === 422 && responseData.errors) {
        const errorMessages = Object.values(responseData.errors).flat().join(', ');
        setError(errorMessages);
        return { success: false, error: errorMessages };
      }
      
      const errorMessage = responseData.message || 'Failed to create candidate';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      console.error('Create candidate error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCandidate = async (candidateData: UpdateCandidateData): Promise<{ success: boolean; error?: string; data?: PresidentialCandidate }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { id, ...updateData } = candidateData;
      console.log('Updating candidate:', id, updateData);
      
      const response = await apiCall<ApiResponse<PresidentialCandidate>>(`/presidential-candidates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      console.log('Update candidate response status:', response.status);
      console.log('Update candidate response ok:', response.ok);
      
      const responseData = await response.json();
      console.log('Update candidate response data:', responseData);
      
      if (response.ok && responseData.success) {
        const updatedCandidate = responseData.data;
        setCandidates(prev => 
          prev.map(candidate => 
            candidate.id === id ? updatedCandidate : candidate
          )
        );
        return { success: true, data: updatedCandidate };
      }
      
      // Handle validation errors
      if (response.status === 422 && responseData.errors) {
        const errorMessages = Object.values(responseData.errors).flat().join(', ');
        setError(errorMessages);
        return { success: false, error: errorMessages };
      }
      
      const errorMessage = responseData.message || 'Failed to update candidate';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      console.error('Update candidate error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCandidate = async (id: number): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Deleting candidate:', id);
      
      const response = await apiCall<ApiResponse>(`/presidential-candidates/${id}`, {
        method: 'DELETE',
      });
      
      console.log('Delete candidate response status:', response.status);
      console.log('Delete candidate response ok:', response.ok);
      
      const responseData = await response.json();
      console.log('Delete candidate response data:', responseData);
      
      if (response.ok && responseData.success) {
        setCandidates(prev => prev.filter(candidate => candidate.id !== id));
        return { success: true };
      }
      
      const errorMessage = responseData.message || 'Failed to delete candidate';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      console.error('Delete candidate error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCandidates = async (): Promise<void> => {
    await fetchCandidates();
  };

  // Automatically fetch candidates when the provider mounts
  useEffect(() => {
    fetchCandidates();
  }, []);

  const value: CandidateContextType = {
    candidates,
    isLoading,
    error,
    fetchCandidates,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    refreshCandidates,
  };

  return (
    <CandidateContext.Provider value={value}>
      {children}
    </CandidateContext.Provider>
  );
}

export const useCandidate = (): CandidateContextType => {
  const context = useContext(CandidateContext);
  if (context === undefined) {
    throw new Error('useCandidate must be used within a CandidateProvider');
  }
  return context;
};