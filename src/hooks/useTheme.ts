/**
 * Theme hook for managing light/dark mode
 */

import { useCallback, useEffect } from 'react';
import { useThemeStore, useResolvedTheme, useIsDarkMode } from '@/store/themeStore';
import { watchSystemTheme } from '@/config/theme';
import type { Theme } from '@/types';

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  
  const resolvedTheme = useResolvedTheme();
  const isDarkMode = useIsDarkMode();

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Watch for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const unwatch = watchSystemTheme(() => {
        // Theme store already handles this, but we trigger re-render
        initializeTheme();
      });
      return unwatch;
    }
    return undefined;
  }, [theme, initializeTheme]);

  // Set specific theme
  const changeTheme = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
    },
    [setTheme]
  );

  // Toggle between light and dark
  const toggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  // Set light theme
  const setLightTheme = useCallback(() => {
    setTheme('light');
  }, [setTheme]);

  // Set dark theme
  const setDarkTheme = useCallback(() => {
    setTheme('dark');
  }, [setTheme]);

  // Set system theme
  const setSystemTheme = useCallback(() => {
    setTheme('system');
  }, [setTheme]);

  return {
    // Current theme setting
    theme,
    
    // Resolved theme (actual theme being used)
    resolvedTheme,
    
    // Boolean helpers
    isDarkMode,
    isLightMode: !isDarkMode,
    isSystemTheme: theme === 'system',
    
    // Actions
    setTheme: changeTheme,
    toggleTheme: toggle,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
  };
}
