// src/core/theme/themes.js

/**
 * NeuroLedger Theme Definitions
 *
 * This file contains the theme definitions for the application.
 * It defines colors, typography, spacing, and other design tokens
 * for both light and dark modes.
 */

const baseTheme = {
  // Spacing scale (in pixels)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // Typography
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      xxl: '1.5rem',    // 24px
      xxxl: '2rem',     // 32px
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    }
  },

  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    circle: '50%',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
  },
};

// Light theme colors
const lightTheme = {
  ...baseTheme,
  colors: {
    // Brand colors
    primary: {
      50: '#EBF5FF',
      100: '#DBEAFF',
      200: '#B7D5FF',
      300: '#93BFFF',
      400: '#6FA9FF',
      500: '#4B94FF', // Primary brand color
      600: '#2973E2',
      700: '#1D5ABF',
      800: '#13409A',
      900: '#0B2866',
    },

    // Gray scale
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },

    // Semantic colors
    success: {
      50: '#ECFDF5',
      500: '#10B981',
      700: '#047857',
    },
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',
      700: '#B45309',
    },
    error: {
      50: '#FEF2F2',
      500: '#EF4444',
      700: '#B91C1C',
    },
    info: {
      50: '#EFF6FF',
      500: '#3B82F6',
      700: '#1D4ED8',
    },

    // UI colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      tertiary: '#9CA3AF',
      disabled: '#D1D5DB',
      inverse: '#FFFFFF',
    },
    border: {
      light: '#E5E7EB',
      normal: '#D1D5DB',
      dark: '#9CA3AF',
    },
    divider: '#E5E7EB',
  },
};

// Dark theme colors
const darkTheme = {
  ...baseTheme,
  colors: {
    // Brand colors (slightly adjusted for dark mode)
    primary: {
      50: '#0B2866',
      100: '#13409A',
      200: '#1D5ABF',
      300: '#2973E2',
      400: '#4B94FF',
      500: '#60A5FF', // Primary brand color for dark mode
      600: '#93BFFF',
      700: '#B7D5FF',
      800: '#DBEAFF',
      900: '#EBF5FF',
    },

    // Gray scale
    gray: {
      50: '#111827',
      100: '#1F2937',
      200: '#374151',
      300: '#4B5563',
      400: '#6B7280',
      500: '#9CA3AF',
      600: '#D1D5DB',
      700: '#E5E7EB',
      800: '#F3F4F6',
      900: '#F9FAFB',
    },

    // Semantic colors (adjusted for dark mode)
    success: {
      50: '#064E3B',
      500: '#34D399',
      700: '#ECFDF5',
    },
    warning: {
      50: '#78350F',
      500: '#FBBF24',
      700: '#FFFBEB',
    },
    error: {
      50: '#7F1D1D',
      500: '#F87171',
      700: '#FEF2F2',
    },
    info: {
      50: '#1E3A8A',
      500: '#60A5FA',
      700: '#EFF6FF',
    },

    // UI colors
    background: {
      primary: '#111827',
      secondary: '#1F2937',
      tertiary: '#374151',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      tertiary: '#9CA3AF',
      disabled: '#4B5563',
      inverse: '#111827',
    },
    border: {
      light: '#374151',
      normal: '#4B5563',
      dark: '#6B7280',
    },
    divider: '#374151',
  },
};

// Export theme configurations
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export default themes;