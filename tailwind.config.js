/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#C6FF00', // Neon Lime
          foreground: '#0F110A',
        },
        secondary: {
          DEFAULT: '#8A7AD0', // Soft Purple
          foreground: '#FFFFFF',
        },
        dark: {
          DEFAULT: '#0F110A',
          lighter: '#1A1C1E',
        },
        light: '#E8EBEF',
        background: '#E8EBEF', // Default background
        foreground: '#0F110A', // Default text
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1A1C1E',
        },
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280',
        },
        border: '#E5E7EB',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'neon': '0 0 20px rgba(198, 255, 0, 0.3)'
      }
    },
  },
  plugins: [],
}
