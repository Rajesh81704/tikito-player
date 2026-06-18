/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Dark base surfaces
        surface: {
          bg: '#071c12',
          card: '#122b1f',
          elevated: '#1f4a33',
          border: '#31593f',
          muted: '#204e3e',
        },
        // App gold accent for text and highlights
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C56A',
          dim: '#8A6E28',
          glow: 'rgba(201,168,76,0.15)',
        },
        // Accent - green for turf look and feel
        accent: {
          DEFAULT: '#5BD08E',
          light: '#82E5B6',
          dim: '#3A9B6A',
          glow: 'rgba(91,208,142,0.18)',
        },
        // Green for sports/turf
        pitch: {
          DEFAULT: '#2ECC71',
          dim: '#1A9952',
          soft: 'rgba(46,204,113,0.12)',
        },
        // Text hierarchy
        ink: {
          primary: '#F5F0E8',
          secondary: '#A8A090',
          muted: '#6B6B7A',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['-apple-system', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
