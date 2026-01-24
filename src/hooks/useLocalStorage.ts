/**
 * Hook for using localStorage with React state
 */

import { useState, useCallback, useEffect } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Get initial value from storage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = getStorageItem<T>(key);
    return item !== null ? item : initialValue;
  });

  // Update storage when value changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        setStorageItem(key, newValue);
        return newValue;
      });
    },
    [key]
  );

  // Remove value from storage
  const removeValue = useCallback(() => {
    removeStorageItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  // Sync with storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          setStoredValue(e.newValue as unknown as T);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
