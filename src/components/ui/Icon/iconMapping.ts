/**
 * Icon Mapping - PrimeIcons to Material Symbols Rounded
 * Based on Figma design which uses Material Symbols Rounded
 */

export const ICON_MAPPING: Record<string, string> = {
  // Navigation icons
  'pi-chart-line': 'area_chart', // Dashboard
  'pi-box': 'package_2', // Orders
  'pi-book': 'book_5', // Schemes
  'pi-gem': 'diamond', // Jewels
  'pi-id-card': 'app_registration', // Content
  'pi-users': 'person', // Customers (Figma uses PERSON)
  
  // Common icons
  'pi-home': 'home',
  'pi-user': 'person',
  'pi-cog': 'settings',
  'pi-bars': 'menu',
  'pi-angle-left': 'chevron_left',
  'pi-angle-right': 'chevron_right',
  'pi-angle-down': 'keyboard_arrow_down',
  'pi-angle-up': 'keyboard_arrow_up',
  'pi-chevron-down': 'keyboard_arrow_down',
  'pi-chevron-up': 'keyboard_arrow_up',
  'pi-chevron-left': 'chevron_left',
  'pi-chevron-right': 'chevron_right',
  'pi-sign-out': 'logout',
  'pi-sign-in': 'login',
  'pi-bell': 'notifications',
  'pi-star-fill': 'star',
  'pi-star': 'star',
  'pi-external-link': 'open_in_new',
  'pi-check': 'check',
  'pi-times': 'close',
  'pi-times-circle': 'cancel',
  'pi-plus': 'add',
  'pi-minus': 'remove',
  'pi-edit': 'edit',
  'pi-trash': 'delete',
  'pi-search': 'search',
  'pi-filter': 'filter_list',
  'pi-sort': 'sort',
  'pi-sort-up': 'arrow_upward',
  'pi-sort-down': 'arrow_downward',
  'pi-calendar': 'calendar_today',
  'pi-clock': 'schedule',
  'pi-eye': 'visibility',
  'pi-eye-slash': 'visibility_off',
  'pi-lock': 'lock',
  'pi-unlock': 'lock_open',
  'pi-key': 'vpn_key',
  'pi-envelope': 'email',
  'pi-phone': 'phone',
  'pi-map-marker': 'location_on',
  'pi-globe': 'language',
  'pi-sun': 'light_mode',
  'pi-moon': 'dark_mode',
  'pi-desktop': 'computer',
  
  // Admin icons
  'pi-th-large': 'dashboard', // Admin dashboard
  'pi-building': 'store', // Merchants
  'pi-chart-bar': 'bar_chart', // Reports
  
  // Additional icons found in codebase
  'pi-sign-in': 'login',
  'pi-pencil': 'edit',
  'pi-indian-rupee': 'currency_rupee',
  'pi-shopping-cart': 'shopping_cart',
  'pi-arrow-up': 'arrow_upward',
  'pi-arrow-down': 'arrow_downward',
  'pi-arrow-left': 'arrow_back',
  'pi-arrow-right': 'arrow_forward',
  'pi-list': 'list',
  'pi-send': 'send',
  'pi-user-plus': 'person_add',
  'pi-left-panel-open': 'left_panel_open',
  'pi-left-panel-close': 'left_panel_close',
  
  // Status icons
  'pi-check-circle': 'check_circle',
  'pi-info-circle': 'info',
  'pi-exclamation-triangle': 'warning',
  'pi-times-circle': 'error',
  'pi-spin': 'refresh', // Loading
  
  // Form icons
  'pi-upload': 'upload',
  'pi-download': 'download',
  'pi-file': 'description',
  'pi-image': 'image',
  
  // Action icons
  'pi-save': 'save',
  'pi-refresh': 'refresh',
  'pi-print': 'print',
  'pi-share': 'share',
  'pi-copy': 'content_copy',
  'pi-undo': 'undo',
  'pi-redo': 'redo',
};

/**
 * Convert PrimeIcon class name to Material Symbols name
 */
export function getMaterialIconName(primeIconClass: string): string {
  // Remove 'pi' prefix if present
  const iconKey = primeIconClass.startsWith('pi ') 
    ? primeIconClass.replace('pi ', 'pi-')
    : primeIconClass.startsWith('pi-')
    ? primeIconClass
    : `pi-${primeIconClass}`;
  
  return ICON_MAPPING[iconKey] || iconKey.replace('pi-', '').replace(/_/g, '_');
}

/**
 * Check if an icon name exists in mapping
 */
export function hasIconMapping(primeIconClass: string): boolean {
  const iconKey = primeIconClass.startsWith('pi ') 
    ? primeIconClass.replace('pi ', 'pi-')
    : primeIconClass.startsWith('pi-')
    ? primeIconClass
    : `pi-${primeIconClass}`;
  
  return iconKey in ICON_MAPPING;
}
