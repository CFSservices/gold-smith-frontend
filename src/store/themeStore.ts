/**
 * Theme store using Zustand
 * Manages light/dark/system theme with PrimeReact integration
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Theme } from '@/types';
import { STORAGE_KEYS } from '@/config/constants';
import { getSystemTheme, applyTheme, watchSystemTheme } from '@/config/theme';

// Theme state interface
interface ThemeState {
  // State
  theme: Theme;
  resolvedTheme: 'light' | 'dark';

  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

// Cleanup function for system theme watcher
let systemThemeCleanup: (() => void) | null = null;

// Create the store
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      resolvedTheme: 'light',

      // Set theme
      setTheme: (theme) => {
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
        
        set({
          theme,
          resolvedTheme,
        });

        // Apply theme to document and PrimeReact
        applyTheme(theme);

        // Manage system theme watcher
        if (systemThemeCleanup) {
          systemThemeCleanup();
          systemThemeCleanup = null;
        }

        if (theme === 'system') {
          systemThemeCleanup = watchSystemTheme((newSystemTheme) => {
            const currentTheme = get().theme;
            if (currentTheme === 'system') {
              set({ resolvedTheme: newSystemTheme });
              applyTheme('system');
            }
          });
        }
      },

      // Toggle between light and dark
      toggleTheme: () => {
        const { theme, resolvedTheme } = get();
        
        // If using system theme, switch to the opposite of current resolved theme
        if (theme === 'system') {
          const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
          get().setTheme(newTheme);
        } else {
          // Toggle between light and dark
          const newTheme = theme === 'light' ? 'dark' : 'light';
          get().setTheme(newTheme);
        }
      },

      // Initialize theme on app load
      initializeTheme: () => {
        const { theme } = get();
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
        
        set({ resolvedTheme });
        applyTheme(theme);

        // Set up system theme watcher if using system theme
        if (theme === 'system' && !systemThemeCleanup) {
          systemThemeCleanup = watchSystemTheme((newSystemTheme) => {
            const currentTheme = get().theme;
            if (currentTheme === 'system') {
              set({ resolvedTheme: newSystemTheme });
              applyTheme('system');
            }
          });
        }
      },
    }),
    {
      name: STORAGE_KEYS.theme,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        // Initialize theme after rehydration
        if (state) {
          // Delay initialization to ensure DOM is ready
          setTimeout(() => {
            state.initializeTheme();
          }, 0);
        }
      },
    }
  )
);

// Selector hooks
export const useTheme = () => useThemeStore((state) => state.theme);
export const useResolvedTheme = () => useThemeStore((state) => state.resolvedTheme);
export const useIsDarkMode = () => useThemeStore((state) => state.resolvedTheme === 'dark');
