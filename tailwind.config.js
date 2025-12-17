/** @type {import('tailwindcss').Config} */

import { colors } from './config/theme.js';

module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: colors.dark,           // #171719 - Primary dark
        highlight: colors.highlight, // #d3f26a - Accent lime
        accent: colors.accent,       // #ad7bff - Purple accent
        light: colors.light,         // #f2f4f0 - Light background
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
