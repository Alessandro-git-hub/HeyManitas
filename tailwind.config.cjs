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
        // Core Palette - simplified to only needed colors
        primary: {
          700: '#334340',        // Dark Green-Gray
        },
        secondary: {
          600: '#cda961',        // Golden Brass  
        },
        brown: {
          DEFAULT: '#6F4E37',    // Brown
          500: '#6F4E37'
        },
        beige: {
          DEFAULT: '#f4dfb8',    // Beige
          50: '#f4dfb8'
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
        deep: '#334340',         // Primary Dark
      },
    },
  },
  plugins: [],
}
