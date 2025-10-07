/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f0ff',
          100: '#b3d9ff',
          200: '#80c2ff',
          300: '#4dabff',
          400: '#269aff',
          500: '#0762d9',
          600: '#0553b8',
          700: '#044497',
          800: '#033575',
          900: '#012654',
        },
        secondary: {
          50: '#e6faf0',
          100: '#b3f0d2',
          200: '#80e6b5',
          300: '#4ddc97',
          400: '#30d979',
          500: '#26b662',
          600: '#1f934f',
          700: '#18703b',
          800: '#114d28',
          900: '#0a2a15',
        },
        accent: {
          50: '#fde8e8',
          100: '#f9b8b8',
          200: '#f58888',
          300: '#f15858',
          400: '#e74c3c',
          500: '#c0392b',
          600: '#992e22',
          700: '#732319',
          800: '#4c1710',
          900: '#260c08',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Arial', 'sans-serif'],
        display: ['Roboto', 'Nunito', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(7, 98, 217, 0.1)',
        'medium': '0 4px 24px rgba(7, 98, 217, 0.15)',
        'strong': '0 8px 32px rgba(7, 98, 217, 0.2)',
      },
    },
  },
  plugins: [],
}
