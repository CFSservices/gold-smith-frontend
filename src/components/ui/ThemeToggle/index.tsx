/**
 * Theme Toggle component
 */

import { Button } from 'primereact/button';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';

interface ThemeToggleProps {
  /** Show label next to icon */
  showLabel?: boolean;
  /** Custom class name */
  className?: string;
  /** Icon size in pixels */
  iconSize?: number;
}

export function ThemeToggle({ showLabel = false, className, iconSize = 20 }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  const getIcon = () => {
    // Consistent icon color: #675122 (light mode), #d4a574 (dark mode)
    const iconClassName = 'text-[#675122] dark:text-[#d4a574]';
    if (theme === 'system') {
      return <PrimeReactIcon name="computer" size={iconSize} className={iconClassName} />;
    }
    return isDarkMode ? (
      <PrimeReactIcon name="dark_mode" size={iconSize} className={iconClassName} />
    ) : (
      <PrimeReactIcon name="light_mode" size={iconSize} className={iconClassName} />
    );
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
