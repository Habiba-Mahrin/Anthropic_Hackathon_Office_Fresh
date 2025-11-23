// Gentler Streak inspired color palette
export const colors = {
  // Primary colors
  primary: '#FF9B82', // Soft coral/orange
  primaryLight: '#FFD4C4',
  primaryDark: '#E8836D',

  // Secondary colors
  secondary: '#7DD3C0', // Soft mint green
  secondaryLight: '#B4E8DC',
  secondaryDark: '#5DBFA9',

  // Accent colors
  accent: '#FFB366', // Warm peach
  accentLight: '#FFD9A8',

  // Success/Active
  success: '#6FCF97',
  successLight: '#B5E5C7',

  // Warning/Alert
  warning: '#F2994A',
  error: '#EB5757',

  // Neutral colors
  background: '#F7F9FC', // Light blue-gray
  backgroundDark: '#E8EDF4',
  surface: '#FFFFFF',

  // Text colors
  textPrimary: '#2D3748',
  textSecondary: '#718096',
  textLight: '#A0AEC0',
  textWhite: '#FFFFFF',

  // Border colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};
