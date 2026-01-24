/**
 * Environment configuration
 * Type-safe access to environment variables
 */

import type { EnvironmentConfig } from '@/types';

// Helper to get environment variable with fallback
const getEnvVar = (key: string, fallback: string = ''): string => {
  return import.meta.env[key] ?? fallback;
};

// Helper to get boolean environment variable
const getEnvBool = (key: string, fallback: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) {
    return fallback;
  }
  return value === 'true' || value === '1';
};

// Helper to get number environment variable
const getEnvNumber = (key: string, fallback: number): number => {
  const value = import.meta.env[key];
  if (value === undefined) {
    return fallback;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

// Environment configuration object
export const env: EnvironmentConfig = {
  // API Configuration
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080/api/v1'),
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', 30000),

  // Application Configuration
  appName: getEnvVar('VITE_APP_NAME', 'Gold Smith'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  appEnv: getEnvVar('VITE_APP_ENV', 'local') as EnvironmentConfig['appEnv'],

  // Feature Flags
  enableMockApi: getEnvBool('VITE_ENABLE_MOCK_API', true),
  enableDebugMode: getEnvBool('VITE_ENABLE_DEBUG_MODE', true),
  enableDevtools: getEnvBool('VITE_ENABLE_DEVTOOLS', true),
};

// Auth token keys
export const AUTH_KEYS = {
  accessToken: getEnvVar('VITE_AUTH_TOKEN_KEY', 'gs_access_token'),
  refreshToken: getEnvVar('VITE_AUTH_REFRESH_KEY', 'gs_refresh_token'),
  tokenExpiry: getEnvNumber('VITE_AUTH_TOKEN_EXPIRY', 3600),
} as const;

// Helper functions
export const isDevelopment = (): boolean =>
  env.appEnv === 'local' || env.appEnv === 'development';

export const isProduction = (): boolean => env.appEnv === 'production';

export const isTestEnvironment = (): boolean =>
  env.appEnv === 'qa' || env.appEnv === 'uat';

// Debug logging helper
export const debugLog = (...args: unknown[]): void => {
  if (env.enableDebugMode) {
    console.warn('[DEBUG]', ...args);
  }
};
