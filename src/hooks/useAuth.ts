/**
 * Authentication hook with React Query integration
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/api/services/auth.service';
import { setAuthToken, clearAuthToken } from '@/api/client';
import { ROUTES } from '@/config/routes';
import { QueryKeys, MutationKeys } from '@/types/api.types';
import type { LoginRequest, RegisterRequest, User } from '@/types';

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
    isAdmin,
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
      
      // Store tokens
      setAuthToken(tokens.accessToken);
      
      // Update store
      storeLogin(userData, tokens);
      
      // Invalidate and refetch user data
      void queryClient.invalidateQueries({ queryKey: QueryKeys.currentUser });
      
      // Navigate based on role
      if (userData.role === 'admin') {
        navigate(ROUTES.admin.dashboard);
      } else {
        navigate(ROUTES.dashboard);
      }
    },
    onError: (error: { message: string }) => {
      setError(error.message);
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationKey: MutationKeys.register,
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: () => {
      // Navigate to login after successful registration
      navigate(ROUTES.login, { 
        state: { message: 'Registration successful! Please login.' } 
      });
    },
    onError: (error: { message: string }) => {
      setError(error.message);
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
    user: (currentUserQuery.data as User | undefined) ?? user,
    isAuthenticated,
    isLoading: storeLoading || loginMutation.isPending || registerMutation.isPending,
    error: storeError,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    clearError,

    // Role helpers
    hasRole,
    isAdmin,

    // Mutation states
    loginStatus: loginMutation.status,
    registerStatus: registerMutation.status,
    forgotPasswordStatus: forgotPasswordMutation.status,
  };
}
