/**
 * Loading Spinner component
 */

import { ProgressSpinner } from 'primereact/progressspinner';
import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  /** Display spinner in full screen mode */
  fullScreen?: boolean;
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Custom class name */
  className?: string;
  /** Loading message to display */
  message?: string;
}

const sizeMap = {
  sm: '30px',
  md: '50px',
  lg: '80px',
};

export function LoadingSpinner({
  fullScreen = false,
  size = 'md',
  className,
  message,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <ProgressSpinner
        style={{ width: sizeMap[size], height: sizeMap[size] }}
        strokeWidth="4"
        animationDuration=".8s"
      />
      {message && (
        <p className="text-secondary-600 dark:text-secondary-400 text-sm">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;
