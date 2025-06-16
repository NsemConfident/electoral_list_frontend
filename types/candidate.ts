// types/candidate.ts
export interface PresidentialCandidate {
  id: number;
  full_name: string;
  date_of_birth: Date;
  place_of_birth: string;
  political_party: string;
  national_id: string;
  region: string;
  email: string;
  phone: string;
  photo: {
    uri: string;
    name: string;
    type: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateResponse {
  success: boolean;
  message: string;
  data: PresidentialCandidate;
}

export interface CandidatesListResponse {
  success: boolean;
  message: string;
  data: PresidentialCandidate[];
}

export interface CreateCandidateData {
  full_name: string;
  date_of_birth: Date;
  place_of_birth: string;
  political_party: string;
  national_id: string;
  region: string;
  email: string;
  phone: string;
  photo: {
    uri: string;
    name: string;
    type: string;
  } | null;
}

export interface UpdateCandidateData extends Partial<CreateCandidateData> {
  id: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}


export interface CandidateContextType {
  candidates: PresidentialCandidate[];
  isLoading: boolean;
  error: string | null;
  fetchCandidates: () => Promise<{ success: boolean; error?: string }>;
  createCandidate: (
    data: CreateCandidateData
  ) => Promise<{
    success: boolean;
    error?: string;
    data?: PresidentialCandidate;
  }>;
  updateCandidate: (
    data: UpdateCandidateData
  ) => Promise<{
    success: boolean;
    error?: string;
    data?: PresidentialCandidate;
  }>;
  deleteCandidate: (
    id: number
  ) => Promise<{ success: boolean; error?: string }>;
  refreshCandidates: () => Promise<void>;
}
