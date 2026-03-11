/**
 * Common types used throughout the application
 */

// Generic ID type
export type ID = string | number;

// Nullable type helper
export type Nullable<T> = T | null;

// Optional type helper
export type Optional<T> = T | undefined;

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// User roles
export type UserRole = 'admin' | 'user' | 'merchant' | 'staff';

// Status types
export type Status = 'active' | 'inactive' | 'pending' | 'suspended';

// Sort order
export type SortOrder = 'asc' | 'desc';

// Pagination params
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Base entity with timestamps
export interface BaseEntity {
  id: ID;
  createdAt: string;
  updatedAt: string;
}

// Select option type
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

// Navigation item
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
  roles?: UserRole[];
  hasDropdown?: boolean; // Indicates if item has dropdown menu (for UI display)
}

// Toast/Notification types
export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface ToastMessage {
  severity: ToastSeverity;
  summary: string;
  detail?: string;
  life?: number;
}

// Form field error
export interface FieldError {
  field: string;
  message: string;
}

// Loading state
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Environment configuration
export interface EnvironmentConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  appName: string;
  appVersion: string;
  appEnv: 'local' | 'development' | 'qa' | 'uat' | 'production';
  enableMockApi: boolean;
  enableDebugMode: boolean;
  enableDevtools: boolean;
}
