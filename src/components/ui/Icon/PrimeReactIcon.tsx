/**
 * PrimeReact Icon Helper
 * Renders Material Symbols icon for PrimeReact components that accept icon prop
 * PrimeReact Button accepts ReactNode for icon, so we can use this
 * 
 * Usage: <Button icon={<PrimeReactIcon name="settings" size={20} />} />
 */

import { Icon, type IconProps } from './index';

/**
 * Render Material Symbols icon as ReactNode for PrimeReact components
 * Use this for PrimeReact Button icon prop
 */
export function PrimeReactIcon({ 
  name, 
  size = 24, 
  filled = false,
  className 
}: IconProps) {
  return <Icon name={name} size={size} filled={filled} className={className} />;
}
