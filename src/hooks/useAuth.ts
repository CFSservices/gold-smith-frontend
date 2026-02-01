/**
 * Authentication hook with React Query integration
 */

import { clearAuthToken, setAuthToken } from '@/api/client';
import { authService } from '@/api/services/auth.service';
import { AUTH_ERRORS } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest } from '@/types';
import { MutationKeys, QueryKeys } from '@/types/api.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const {
    user,
    isAuthenticated,
    isLoading: storeLoading,
    error: storeError,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    setError,
    clearError,
    hasRole,
  } = useAuthStore();

  // Get current user query
  const currentUserQuery = useQuery({
    queryKey: QueryKeys.currentUser,
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationKey: MutationKeys.login,
    mutationFn: (data: LoginRequest) => authService.login(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      const { user: userData, tokens } = response.data;
      
      // Verify user is admin (web app is admin-only)
      if (userData.role !== 'admin') {
        setError(AUTH_ERRORS.ACCESS_DENIED);
        setLoading(false);
        return; // Don't proceed with login
      }
      
      // Store tokens
      setAuthToken(tokens.accessToken);
      
      // Update store
      storeLogin(userData, tokens);
      
      // Invalidate and refetch user data
      void queryClient.invalidateQueries({ queryKey: QueryKeys.currentUser });
      
      // Always navigate to dashboard (admin-only app)
      navigate(ROUTES.dashboard);
    },
    onError: (error: { message: string }) => {
      setError(error.message);
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationKey: MutationKeys.logout,
    mutationFn: () => authService.logout(),
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      // Clear tokens and state
      clearAuthToken();
      storeLogout();
      
      // Clear all queries
      queryClient.clear();
      
      // Navigate to login
      navigate(ROUTES.login);
      
      setLoading(false);
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword({ email }),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onError: (error: { message: string }) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  return {
    // State
    user: (currentUserQuery.data) ?? user,
    isAuthenticated,
    isLoading: storeLoading || loginMutation.isPending,
    error: storeError,

    // Actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    clearError,

    // Role helpers
    hasRole,

    // Mutation states
    loginStatus: loginMutation.status,
    forgotPasswordStatus: forgotPasswordMutation.status,
  };
}
