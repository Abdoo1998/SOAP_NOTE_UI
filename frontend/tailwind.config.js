/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hospital: {
          50: '#eef7ff',
          100: '#d9edff', 
          200: '#bce0ff',
          300: '#8ccbff',
          400: '#49a6ff',
          500: '#1a7fd5',
          600: '#0c66b5',
          700: '#0a5091',
          800: '#0c4377',
          900: '#0f3964',
        },
        accent: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}