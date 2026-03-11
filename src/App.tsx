/**
 * Main App Component
 * Reference: https://primereact.org/configuration/
 */

import { QueryProvider } from '@/lib/queryClient';
import { router } from '@/routes';
import { useThemeStore } from '@/store/themeStore';
import { PrimeReactProvider } from 'primereact/api';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

/**
 * PrimeReact configuration options
 * Reference: https://primereact.org/configuration/
 */
const primeReactConfig = {
  // Enable ripple effect on supported components
  ripple: true,
  
  // Input style: 'outlined' (default) or 'filled'
  inputStyle: 'outlined' as const,
  
  // CSS transitions enabled
  cssTransition: true,
  
  // Z-index configuration for layered components
  zIndex: {
    modal: 1100,    // dialog, sidebar
    overlay: 1000,  // dropdown, overlay panel
    menu: 1000,     // overlay menus
    tooltip: 1100,  // tooltip
    toast: 1200,    // toast
  },
  
  // Auto manage z-index
  autoZIndex: true,
  
  // Null values sort at the bottom (like Excel)
  nullSortOrder: 1,
};

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  // Initialize theme on app load
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <PrimeReactProvider value={primeReactConfig}>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </PrimeReactProvider>
  );
}

export default App;
