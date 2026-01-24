/**
 * Theme configuration for PrimeReact v10
 * Uses dynamic theme switching with changeTheme from PrimeReactContext
 * Reference: https://primereact.org/theming/
 */

import type { Theme } from '@/types';

// Theme options for UI
export const THEMES: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'pi pi-sun' },
  { value: 'dark', label: 'Dark', icon: 'pi pi-moon' },
  { value: 'system', label: 'System', icon: 'pi pi-desktop' },
];

// PrimeReact theme names (lara-*-amber for gold brand)
export const PRIMEREACT_THEMES = {
  light: 'lara-light-amber',
  dark: 'lara-dark-amber',
} as const;

// Theme link element ID (must match the id in index.html)
export const THEME_LINK_ID = 'theme-link';

// CDN base URL for PrimeReact themes
export const THEME_CDN_BASE = 'https://unpkg.com/primereact@10.9.7/resources/themes';

// Get system theme preference
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Get the current theme name from the link element
export const getCurrentThemeName = (): string => {
  const linkElement = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
  if (linkElement) {
    const href = linkElement.href;
    // Extract theme name from URL like ".../themes/lara-light-amber/theme.css"
    const match = href.match(/themes\/([^/]+)\/theme\.css/);
    if (match) {
      return match[1];
    }
  }
  return PRIMEREACT_THEMES.light;
};

// Change PrimeReact theme by updating the link element
export const changePrimeReactTheme = (
  newThemeName: string,
  callback?: () => void
): void => {
  const linkElement = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
  
  if (!linkElement) {
    console.warn('Theme link element not found. Make sure index.html has a link with id="theme-link"');
    return;
  }

  const currentThemeName = getCurrentThemeName();
  
  if (currentThemeName === newThemeName) {
    callback?.();
    return;
  }

  const newThemeUrl = `${THEME_CDN_BASE}/${newThemeName}/theme.css`;
  
  // Create a new link to preload the theme
  const newLink = document.createElement('link');
  newLink.rel = 'stylesheet';
  newLink.href = newThemeUrl;
  
  newLink.onload = () => {
    // Update the original link element
    linkElement.href = newThemeUrl;
    // Remove the preload link
    newLink.remove();
    callback?.();
  };

  newLink.onerror = () => {
    console.error(`Failed to load theme: ${newThemeName}`);
    newLink.remove();
  };

  // Append to head to start loading
  document.head.appendChild(newLink);
};

// Apply theme to document (handles both PrimeReact theme and dark mode class)
export const applyTheme = (theme: Theme): void => {
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;

  // Update dark mode class for Tailwind
  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);

  // Set data attribute
  root.setAttribute('data-theme', resolvedTheme);

  // Change PrimeReact theme
  const themeName = PRIMEREACT_THEMES[resolvedTheme];
  changePrimeReactTheme(themeName);

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      resolvedTheme === 'dark' ? '#1c1917' : '#ffffff'
    );
  }
};

// Watch for system theme changes
export const watchSystemTheme = (callback: (theme: 'light' | 'dark') => void): (() => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handler);
  
  return () => mediaQuery.removeEventListener('change', handler);
};

// Available PrimeReact theme presets for customization
export const AVAILABLE_THEME_PRESETS = {
  // Lara themes (Bootstrap-inspired)
  'lara-light-amber': 'Lara Light Amber',
  'lara-dark-amber': 'Lara Dark Amber',
  'lara-light-blue': 'Lara Light Blue',
  'lara-dark-blue': 'Lara Dark Blue',
  'lara-light-indigo': 'Lara Light Indigo',
  'lara-dark-indigo': 'Lara Dark Indigo',
  'lara-light-purple': 'Lara Light Purple',
  'lara-dark-purple': 'Lara Dark Purple',
  'lara-light-teal': 'Lara Light Teal',
  'lara-dark-teal': 'Lara Dark Teal',
  
  // Soho themes
  'soho-light': 'Soho Light',
  'soho-dark': 'Soho Dark',
  
  // Material Design themes
  'md-light-indigo': 'Material Light Indigo',
  'md-dark-indigo': 'Material Dark Indigo',
  
  // Bootstrap themes
  'bootstrap4-light-blue': 'Bootstrap Light Blue',
  'bootstrap4-dark-blue': 'Bootstrap Dark Blue',
} as const;
