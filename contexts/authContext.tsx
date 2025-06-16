// contexts/AuthContext.tsx
import { VoterStatus } from "@/types/auth";
import { apiCall } from "@/utils/api";
import * as Device from "expo-device";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AuthContextType,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [voterStatus, setVoterStatus] = useState<VoterStatus | null>(null);
  const [biometricToken, setBiometricToken] = useState<string | null>(null);
  const [candidate, setCandidates] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      const storedBiometricToken = await SecureStore.getItemAsync(
        "biometricToken"
      );

      if (token) {
        const [userResponse, voterStatusResponse] = await Promise.all([
          apiCall<User>("/user"),
          apiCall<VoterStatus>("/voter/status"),
        ]);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          await SecureStore.deleteItemAsync("authToken");
        }

        if (voterStatusResponse.ok) {
          const voterData = await voterStatusResponse.json();
          setVoterStatus(voterData.data);
        }
      }

      if (storedBiometricToken) {
        setBiometricToken(storedBiometricToken);
      }
    } catch (error) {
      console.error("Auth loading error:", error);
      await SecureStore.deleteItemAsync("authToken");
      await SecureStore.deleteItemAsync("biometricToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiCall<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await SecureStore.setItemAsync("authToken", data.data.access_token);
        setUser(data.data.user);

        // Check voter status after login
        const statusResponse = await apiCall<VoterStatus>("/voter/status");
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setVoterStatus(statusData.data);
        }

        return { success: true };
      }

      return { success: false, error: data.message || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error occurred" };
    }
  };

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiCall<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        await SecureStore.setItemAsync(
          "authToken",
          responseData.data.access_token
        );
        setUser(responseData.data.user);
        return { success: true };
      }

      if (response.status === 422 && responseData.errors) {
        const errorMessages = Object.values(responseData.errors)
          .flat()
          .join(", ");
        return { success: false, error: errorMessages };
      }

      return {
        success: false,
        error: responseData.message || "Registration failed",
      };
    } catch (error) {
      console.error("Registration error details:", error);
      return { success: false, error: `Network error: ${error.message}` };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiCall("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await SecureStore.deleteItemAsync("authToken");
      await SecureStore.deleteItemAsync("biometricToken");
      setUser(null);
      setVoterStatus(null);
      setBiometricToken(null);
    }
  };

  const checkBiometricSupport = async (): Promise<{
    isAvailable: boolean;
    type?: "fingerprint" | "face" | "iris";
    error?: string;
  }> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware) {
        return {
          isAvailable: false,
          error: "Biometric authentication not available on this device",
        };
      }

      if (!isEnrolled) {
        return {
          isAvailable: false,
          error: "No biometric credentials enrolled",
        };
      }

      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      const type = supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      )
        ? "fingerprint"
        : supportedTypes.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ? "face"
        : "iris";

      return { isAvailable: true, type };
    } catch (error) {
      console.error("Biometric check error:", error);
      return { isAvailable: false, error: "Error checking biometric support" };
    }
  };

  const generateBiometricToken = async (): Promise<string> => {
    // Combine device ID with timestamp and random string for uniqueness
    const deviceId = Device.modelId;
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);

    // Create a hash of these components
    const tokenString = `${deviceId}-${timestamp}-${randomString}`;

    // In a real app, you might want to use a more secure hashing method
    return tokenString;
  };

  const registerAsVoter = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      // First check biometric support
      const biometricSupport = await checkBiometricSupport();
      if (!biometricSupport.isAvailable) {
        return {
          success: false,
          error:
            biometricSupport.error || "Biometric authentication not available",
        };
      }

      // Authenticate with biometrics
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to register as voter",
        fallbackLabel: "Use Passcode",
        disableDeviceFallback: false,
      });

      if (!authResult.success) {
        return { success: false, error: "Biometric authentication failed" };
      }

      // Generate and store a unique token
      const token = await generateBiometricToken();
      setBiometricToken(token);
      await SecureStore.setItemAsync("biometricToken", token);

      // Register with backend
      const response = await apiCall<{ success: boolean; message?: string }>(
        "/auth/voter/register",
        {
          method: "POST",
          body: JSON.stringify({ biometric_token: token }),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        // Update voter status
        const statusResponse = await apiCall<VoterStatus>("/auth/voter/status");
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setVoterStatus(statusData.data);
        }
        return { success: true };
      }

      return {
        success: false,
        error: responseData.message || "Voter registration failed",
      };
    } catch (error) {
      console.error("Voter registration error:", error);
      return { success: false, error: "Error during voter registration" };
    }
  };

  const castVote = async (
    candidateId: number
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!biometricToken) {
        return {
          success: false,
          error: "Biometric token not found. Please register as voter first.",
        };
      }

      // First check biometric support
      const biometricSupport = await checkBiometricSupport();
      if (!biometricSupport.isAvailable) {
        return {
          success: false,
          error:
            biometricSupport.error || "Biometric authentication not available",
        };
      }

      // Authenticate with biometrics
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to cast your vote",
        fallbackLabel: "Use Passcode",
        disableDeviceFallback: false,
      });

      if (!authResult.success) {
        return { success: false, error: "Biometric authentication failed" };
      }

      // Send vote to backend
      const response = await apiCall<{ success: boolean; message?: string }>(
        "/auth/voter/vote",
        {
          method: "POST",
          body: JSON.stringify({
            candidate_id: candidateId,
            biometric_token: biometricToken,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        return { success: true };
      }

      return { success: false, error: responseData.message || "Voting failed" };
    } catch (error) {
      console.error("Voting error:", error);
      return { success: false, error: "Error during voting" };
    }
  };

  const value: AuthContextType = {
    user,
    voterStatus,
    isLoading,
    biometricToken,
    login,
    register,
    logout,
    registerAsVoter,
    castVote,
    checkBiometricSupport,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
