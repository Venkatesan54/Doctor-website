/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        calm: {
          bg: '#F7F7F9',
          surface: '#FFFFFF',
          text: '#0F172A',
          muted: '#6B7280',
          accent: '#94A3B8',
          soft: '#E6E9EE'
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      fontFamily: {
        outfit: ['Outfit', 'Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
