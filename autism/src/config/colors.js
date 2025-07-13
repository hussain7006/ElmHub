export const colors = {
  // Primary Colors
  primary: {
    DEFAULT: '#0070c7', // Strong Blue
    dark: '#0c1d46',    // Deep Navy
    light: '#2e9fda',   // Light Sky Blue
  },
  
  // Secondary Colors
  secondary: {
    DEFAULT: '#6e43b5', // Purple
    light: '#c18fd6',   // Lavender
  },
  
  // Accent Colors
  accent: {
    DEFAULT: '#f16845', // Bright Orange
    light: '#f7a573',   // Soft Peach
  },
  
  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Grayscale
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
  
  // Background Colors
  background: {
    light: '#FFFFFF',
    dark: '#0F172A',
  },
  
  // Text Colors
  text: {
    light: '#1F2937',
    dark: '#F9FAFB',
  }
};

// Theme-specific color mappings
export const themeColors = {
  light: {
    primary: colors.primary.DEFAULT,
    secondary: colors.secondary.DEFAULT,
    accent: colors.accent.DEFAULT,
    background: colors.background.light,
    text: colors.text.light,
  },
  dark: {
    primary: colors.primary.light,
    secondary: colors.secondary.light,
    accent: colors.accent.light,
    background: colors.background.dark,
    text: colors.text.dark,
  }
}; 