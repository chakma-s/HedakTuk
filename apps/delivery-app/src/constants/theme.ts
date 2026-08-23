// Design tokens for the HedakTuk Delivery App
// Dark minimalist design system

export const LightColors = {
  // Backgrounds
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceAlt: '#f1f5f9',
  elevated: '#ffffff',
  card: '#ffffff',

  // Primary (Signature #e7620c)
  primary: '#e7620c',
  primaryLight: '#f0853e',
  primaryDark: '#c4530a',
  primaryBg: 'rgba(231,98,12,0.1)',

  // Success
  success: '#10b981',
  successLight: '#34d399',
  successBg: 'rgba(16,185,129,0.1)',

  // Warning
  warning: '#f59e0b',
  warningBg: 'rgba(245,158,11,0.1)',

  // Info
  info: '#3b82f6',
  infoBg: 'rgba(59,130,246,0.1)',

  // Danger
  danger: '#ef4444',
  dangerBg: 'rgba(239,68,68,0.1)',

  // Text
  text: '#020617',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  textInverse: '#f8fafc',

  // Border
  border: 'rgba(0,0,0,0.08)',
  borderAccent: 'rgba(231,98,12,0.3)',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.6)',
  star: '#f59e0b',

  // Gradient pairs
  gradientPrimary: ['#e7620c', '#f0853e'] as [string, string],
  gradientSuccess: ['#10b981', '#34d399'] as [string, string],
  gradientDark: ['#f1f5f9', '#e2e8f0'] as [string, string],
};

export const DarkColors = {
  // Backgrounds
  background: '#0a0a0a',
  surface: '#111111',
  surfaceAlt: '#141414',
  elevated: '#141414',
  card: '#111111',

  // Primary (Signature #e7620c)
  primary: '#e7620c',
  primaryLight: '#f0853e',
  primaryDark: '#c4530a',
  primaryBg: 'rgba(231,98,12,0.1)',

  // Success
  success: '#10b981',
  successLight: '#34d399',
  successBg: 'rgba(16,185,129,0.1)',

  // Warning
  warning: '#f59e0b',
  warningBg: 'rgba(245,158,11,0.1)',

  // Info
  info: '#6C9FFF',
  infoBg: 'rgba(108,159,255,0.1)',

  // Danger
  danger: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.1)',

  // Text
  text: '#f8fafc',
  textSecondary: '#a1a1aa',
  textTertiary: '#71717a',
  textInverse: '#0a0a0a',

  // Border
  border: 'rgba(255,255,255,0.08)',
  borderAccent: 'rgba(231,98,12,0.3)',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.6)',
  star: '#f59e0b',

  // Gradient pairs
  gradientPrimary: ['#e7620c', '#f0853e'] as [string, string],
  gradientSuccess: ['#10b981', '#34d399'] as [string, string],
  gradientDark: ['#111111', '#0a0a0a'] as [string, string],
};

export type ThemeColors = typeof LightColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 34,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
};
