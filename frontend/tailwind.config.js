/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFD700',
          dark: '#e6c200',
          light: '#ffe44d',
          50: '#fffef0',
          100: '#fffccc',
          200: '#fff799',
          300: '#ffef55',
          400: '#ffe620',
          500: '#FFD700',
          600: '#e6c200',
          700: '#b89600',
          800: '#8a6f00',
          900: '#5c4a00',
        },
        navy: {
          DEFAULT: '#1a2233',
          light: '#2d3748',
          dark: '#111827',
          50: '#f0f2f5',
          100: '#d1d5e0',
          200: '#a3abbd',
          300: '#75819a',
          400: '#4a5568',
          500: '#2d3748',
          600: '#1a2233',
          700: '#141a28',
          800: '#0e121d',
          900: '#080b12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.15)',
        'glow-gold-lg': '0 0 40px rgba(255, 215, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
