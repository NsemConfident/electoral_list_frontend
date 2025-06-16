// types/auth.ts
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    token_type: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  password_confirmation: string;
}
export interface VoterStatus {
  is_registered: boolean;
  has_voted: boolean;
  voted_candidate_id?: number;
}
export interface AuthContextType {
  user: User | null;
  voterStatus: VoterStatus | null;
  isLoading: boolean;
  biometricToken: string | null;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  registerAsVoter: () => Promise<{ success: boolean; error?: string }>;
  castVote: (
    candidateId: number
  ) => Promise<{ success: boolean; error?: string }>;
  checkBiometricSupport: () => Promise<{
    isAvailable: boolean;
    type?: "fingerprint" | "face" | "iris";
    error?: string;
  }>;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
