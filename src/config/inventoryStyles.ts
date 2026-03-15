/**
 * Shared style constants for inventory / jewel UI
 */

import type React from 'react';

export const INVENTORY_THEME = {
  primary: '#704F01',
  primaryLight: '#f2debe',
  neutral: '#545455',
  neutralLight: '#f2f2f2',
  border: '#CCCCCC',
  muted: '#555555',
  background: '#faf8f5',
  backgroundDark: '#2a2a2a',
  cardBorder: '#e5e5e5',
  cardBgDark: '#1e1e1e',
  danger: '#dc2626',
} as const;

export const BUTTON_STYLES = {
  iconButton: {
    padding: 0,
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px',
    width: '32px',
    boxShadow: 'none',
  } as React.CSSProperties,
  primaryButton: {
    border: 'none',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    backgroundColor: INVENTORY_THEME.primary,
    color: 'white',
    gap: '4px',
  } as React.CSSProperties,
  secondaryButton: {
    padding: '8px 12px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    margin: 0,
    backgroundColor: INVENTORY_THEME.neutralLight,
    color: INVENTORY_THEME.neutral,
    boxShadow: 'none',
  } as React.CSSProperties,
  saveButton: {
    padding: '8px 12px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    margin: 0,
    backgroundColor: INVENTORY_THEME.primaryLight,
    color: INVENTORY_THEME.primary,
    boxShadow: 'none',
  } as React.CSSProperties,
  addDetailButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: INVENTORY_THEME.neutralLight,
    color: INVENTORY_THEME.primary,
  } as React.CSSProperties,
} as const;

export const FILE_UPLOAD_CLASSES = {
  choose: '!bg-[#545455] !border-[#545455] !text-white shadow-none',
  upload: '!bg-[#704f01] !border-[#704f01] !text-white shadow-none',
  cancel: '!bg-[#704f01] !border-[#704f01] !text-white shadow-none',
} as const;

/** Dark mode table colors: bluish-gray background, white text, gold accent for active states */
export const DATA_TABLE_DARK_PT = {
  root: {
    className: 'dark:!bg-[#2A2D3B] dark:!text-white dark:border dark:border-[#3d4150] rounded-lg overflow-hidden',
  },
  header: {
    className: 'dark:!bg-[#2A2D3B] dark:!text-white dark:border-b dark:border-[#3d4150]',
  },
  thead: {
    className: 'dark:!bg-[#2A2D3B] dark:!text-white',
  },
  headerRow: {
    className: 'dark:!bg-[#2A2D3B] dark:!text-white',
  },
  headerCell: {
    className: 'dark:!bg-[#2A2D3B] dark:!text-white dark:font-semibold dark:border-b dark:border-[#3d4150]',
  },
  body: {
    className: 'dark:!bg-[#2A2D3B] dark:!text-white',
  },
  tbody: {
    className: 'dark:!bg-[#2A2D3B]',
  },
  bodyRow: {
    className: 'dark:!bg-[#2A2D3B] dark:!text-white dark:hover:!bg-[#35384A] dark:border-b dark:border-[#3d4150]',
  },
  column: {
    bodyCell: {
      className: 'dark:!bg-[#2A2D3B] dark:!text-white dark:border-b dark:border-[#3d4150]',
    },
  },
  footer: {
    className: 'dark:!bg-[#2A2D3B] dark:!text-white dark:border-t dark:border-[#3d4150]',
  },
  paginator: {
    root: {
      className: 'dark:!bg-[#2A2D3B] dark:!text-white dark:border-t dark:border-[#3d4150]',
    },
    first: {
      className: 'dark:!text-white dark:hover:!bg-[#35384A] dark:!border-[#3d4150]',
    },
    prev: {
      className: 'dark:!text-white dark:hover:!bg-[#35384A] dark:!border-[#3d4150]',
    },
    next: {
      className: 'dark:!text-white dark:hover:!bg-[#35384A] dark:!border-[#3d4150]',
    },
    last: {
      className: 'dark:!text-white dark:hover:!bg-[#35384A] dark:!border-[#3d4150]',
    },
    pageButton: ({ context }: { context?: { active?: boolean } }) => ({
      className: context?.active
        ? 'dark:!bg-[#b8860b] dark:!text-[#1c1917] dark:!border-[#b8860b]'
        : 'dark:!text-white dark:hover:!bg-[#35384A] dark:!border-[#3d4150]',
    }),
    rowsPerPageDropdown: {
      root: {
        className: 'dark:!bg-[#35384A] dark:!text-white dark:!border-[#3d4150]',
      },
    },
  },
} as const;