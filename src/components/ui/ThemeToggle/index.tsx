/**
 * Theme Toggle component
 */

import { Button } from 'primereact/button';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  /** Show label next to icon */
  showLabel?: boolean;
  /** Custom class name */
  className?: string;
}

export function ThemeToggle({ showLabel = false, className }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  const getIcon = () => {
    if (theme === 'system') {
      return 'pi pi-desktop';
    }
    return isDarkMode ? 'pi pi-moon' : 'pi pi-sun';
  };

  const getLabel = () => {
    if (theme === 'system') {
      return 'System';
    }
    return isDarkMode ? 'Dark' : 'Light';
  };

  return (
    <Button
      icon={getIcon()}
      label={showLabel ? getLabel() : undefined}
      onClick={toggleTheme}
      text
      severity="secondary"
      tooltip={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      tooltipOptions={{ position: 'bottom' }}
      className={cn(
        'transition-colors',
        'hover:bg-secondary-100 dark:hover:bg-secondary-700',
        className
      )}
    />
  );
}

export default ThemeToggle;
