/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Open Sans', 'system-ui', 'sans-serif'],           // Primary font for body text
        'ui': ['Inter', 'system-ui', 'sans-serif'],                 // UI elements (buttons, forms)
        'accessible': ['Atkinson Hyperlegible', 'system-ui', 'sans-serif'], // Critical text (navigation, instructions)
      },
      colors: {
        // Core Palette with variations
        primary: {
          DEFAULT: '#334340',    // Dark Green-Gray
          50: '#f6f8f7',
          100: '#e8ece9',
          200: '#d3dbd6',
          300: '#b4c1b8',
          400: '#8ea095',
          500: '#6d7f75',
          600: '#57695e',
          700: '#47564c',
          800: '#334340',
          900: '#2c3a36',
        },
        secondary: {
          DEFAULT: '#cda961',    // Golden Brass
          50: '#fdf9f0',
          100: '#faf0dc',
          200: '#f4dfb8',
          300: '#ecc88a',
          400: '#e2ae5a',
          500: '#da9539',
          600: '#cda961',
          700: '#a6733c',
          800: '#875d33',
          900: '#6f4d2e',
        },
        accent: {
          DEFAULT: '#F97316',    // Energetic Orange
          50: '#FFF7ED',
          100: '#FFEDD5',
          600: '#F97316',
          700: '#EA580C',
        },
        success: {
          DEFAULT: '#10B981',    // Fresh Green
          50: '#ECFDF5',
          100: '#D1FAE5',
          600: '#10B981',
          700: '#047857',
          800: '#065F46',
        },
        warning: {
          DEFAULT: '#F59E0B',    // Warm Amber
          50: '#FFFBEB',
          100: '#FEF3C7',
          600: '#F59E0B',
          700: '#D97706',
          800: '#92400E',
        },
        error: {
          DEFAULT: '#EF4444',    // Alert Red
          50: '#FEF2F2',
          100: '#FEE2E2',
          600: '#EF4444',
          700: '#DC2626',
        },
        
        // Neutral & Background
        light: '#F9FAFB',        // Soft White
        base: '#F3F4F6',         // Cool Gray
        deep: '#334340',         // Primary Dark (matching new primary color)
      },
    },
  },
  plugins: [],
}
