// Design tokens for the HedakTuk app
// Swiggy/Zomato dark mode inspired

export const LightColors = {
  // Backgrounds
  background: '#FFFFFF',
  surface: '#F5F5F7',
  surfaceAlt: '#EBEBF0',
  elevated: '#FFFFFF',
  card: '#FFFFFF',

  // Primary (Signature #FF8008)
  primary: '#FF8008',
  primaryLight: '#FFA852',
  primaryDark: '#CC6606',
  primaryBg: 'rgba(255,128,8,0.1)',

  // Success
  success: '#00D9A6',
  successLight: '#34E8BE',
  successBg: 'rgba(0,217,166,0.1)',

  // Warning
  warning: '#FFB74D',
  warningBg: 'rgba(255,183,77,0.1)',

  // Info
  info: '#6C9FFF',
  infoBg: 'rgba(108,159,255,0.1)',

  // Danger
  danger: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.1)',

  // Text
  text: '#0A0A0F',
  textSecondary: '#5A5A6E',
  textTertiary: '#8E8EA0',
  textInverse: '#FFFFFF',

  // Border
  border: 'rgba(0,0,0,0.06)',
  borderAccent: 'rgba(255,128,8,0.3)',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.6)',
  star: '#FFB74D',

  // Gradient pairs
  gradientPrimary: ['#FF8008', '#FFB152'] as [string, string],
  gradientSuccess: ['#00D9A6', '#22D3EE'] as [string, string],
  gradientDark: ['#F5F5F7', '#EBEBF0'] as [string, string],
};

export const DarkColors = {
  // Backgrounds
  background: '#0A0A0F',
  surface: '#14141F',
  surfaceAlt: '#1A1A2E',
  elevated: '#1E1E30',
  card: '#16162A',

  // Primary (Signature #FF8008)
  primary: '#FF8008',
  primaryLight: '#FFA852',
  primaryDark: '#CC6606',
  primaryBg: 'rgba(255,128,8,0.1)',

  // Success
  success: '#00D9A6',
  successLight: '#34E8BE',
  successBg: 'rgba(0,217,166,0.1)',

  // Warning
  warning: '#FFB74D',
  warningBg: 'rgba(255,183,77,0.1)',

  // Info
  info: '#6C9FFF',
  infoBg: 'rgba(108,159,255,0.1)',

  // Danger
  danger: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.1)',

  // Text
  text: '#F0F0F5',
  textSecondary: '#8E8EA0',
  textTertiary: '#5A5A6E',
  textInverse: '#0A0A0F',

  // Border
  border: 'rgba(255,255,255,0.06)',
  borderAccent: 'rgba(255,128,8,0.3)',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.6)',
  star: '#FFB74D',

  // Gradient pairs
  gradientPrimary: ['#FF8008', '#FFB152'] as [string, string],
  gradientSuccess: ['#00D9A6', '#22D3EE'] as [string, string],
  gradientDark: ['#14141F', '#0A0A0F'] as [string, string],
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
};
