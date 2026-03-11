/**
 * Authentication store using Zustand
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { User, AuthTokens, UserRole } from '@/types';
import { STORAGE_KEYS } from '@/config/constants';
import { removeStorageItem } from '@/utils/storage';

// Auth state interface
interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;

  // Computed helpers
  hasRole: (role: UserRole) => boolean;
}

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create the store
export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      ...initialState,

      // Set user
      setUser: (user) => {
        set((state) => {
          state.user = user;
          state.isAuthenticated = user !== null;
        });
      },

      // Set tokens
      setTokens: (tokens) => {
        set((state) => {
          if (tokens) {
            state.accessToken = tokens.accessToken;
            state.refreshToken = tokens.refreshToken;
          } else {
            state.accessToken = null;
            state.refreshToken = null;
          }
        });
      },

      // Set loading state
      setLoading: (isLoading) => {
        set((state) => {
          state.isLoading = isLoading;
        });
      },

      // Set error
      setError: (error) => {
        set((state) => {
          state.error = error;
        });
      },

      // Login action
      login: (user, tokens) => {
        set((state) => {
          state.user = user;
          state.accessToken = tokens.accessToken;
          state.refreshToken = tokens.refreshToken;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        });
      },

      // Logout action
      logout: () => {
        set((state) => {
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
        });
        // Clear tokens from storage
        removeStorageItem(STORAGE_KEYS.accessToken);
        removeStorageItem(STORAGE_KEYS.refreshToken);
      },

      // Update user
      updateUser: (updates) => {
        set((state) => {
          if (state.user) {
            state.user = { ...state.user, ...updates };
          }
        });
      },

      // Clear error
      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },

      // Check if user has specific role
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
