// Design tokens — dark, classy, editorial
export const C = {
  // Backgrounds
  bg: '#071c12',
  card: '#122b1f',
  elevated: '#1f4a33',
  border: '#31593f',
  muted: '#204e3e',

  // Accent — green
  gold: '#5BD08E',
  goldLight: '#82E5B6',
  goldDim: '#3A9B6A',
  goldGlow: 'rgba(91,208,142,0.18)',

  // Sports green
  green: '#2ECC71',
  greenDim: '#1A9952',
  greenSoft: 'rgba(46,204,113,0.16)',
  greenBorder: 'rgba(46,204,113,0.25)',

  // Text
  textPrimary: '#E8F6EE',
  textSecondary: '#B8D8BE',
  textMuted: '#8AA896',

  // Semantic
  error: '#E05252',
  warning: '#E8A838',
  success: '#2ECC71',

  // Font families
  serif: 'Georgia',
  sans: undefined, // System font (SF Pro on iOS)
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  full: 999,
} as const;
