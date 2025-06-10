// components/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/authContext';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/(auth)/login' }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Redirect href={redirectTo} />;
  }

  return <>{children}</>;
}

// components/GuestRoute.tsx
interface GuestRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function GuestRoute({ children, redirectTo = '/(tabs)' }: GuestRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Redirect href={redirectTo} />;
  }

  return <>{children}</>;
}