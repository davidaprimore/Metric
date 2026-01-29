/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Lavanda Metrika (cuidado com contraste!)
        lavender: {
          50: '#FAF8FC',  // Fundo principal (não é branco!)
          100: '#F3E8F7', // Fundo secundário
          200: '#E8D5F0', // Hover suave
          300: '#D4B8E0', // Lilás claro (imagem)
          400: '#C8A4D4', // Cor primária (CENTRO DA IMAGEM)
          500: '#B085C4', // Primária hover
          600: '#9B6AB0', // Botões primários
          700: '#7D5490', // Textos importantes
          800: '#5D3D6B', // Títulos (contraste forte)
          900: '#3D2646', // Texto em cima de lavanda claro
        },
        // Cores de contraste (para usar em cima do lilás claro)
        ink: {
          DEFAULT: '#2D2A32', // Quase preto, mais suave que #000
          light: '#5A5560',
          muted: '#8B8591',
        },
        // Cores semânticas
        surface: '#FFFFFF',
        background: '#FAF8FC', // Fundo geral (off-white lilás)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.9' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(93, 61, 107, 0.06)',
        'lift': '0 8px 30px rgba(93, 61, 107, 0.12)',
        'glow': '0 0 20px rgba(200, 164, 212, 0.4)',
        'nav': '0 -4px 20px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
}
