/**
 * Local storage utilities with type safety
 */

import { debugLog } from '@/config/env';

/**
 * Get item from localStorage with JSON parsing
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    debugLog(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Set item in localStorage with JSON stringification
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    debugLog(`Error writing to localStorage key "${key}":`, error);
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    debugLog(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    debugLog('Error clearing localStorage:', error);
  }
}

/**
 * Get item from sessionStorage with JSON parsing
 */
export function getSessionItem<T>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    debugLog(`Error reading from sessionStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Set item in sessionStorage with JSON stringification
 */
export function setSessionItem<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    debugLog(`Error writing to sessionStorage key "${key}":`, error);
  }
}

/**
 * Remove item from sessionStorage
 */
export function removeSessionItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    debugLog(`Error removing sessionStorage key "${key}":`, error);
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
