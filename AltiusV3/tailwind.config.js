/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de Colores Oficial Altius Academy
        primary: {
          DEFAULT: '#385ADB', // Azul Principal
          50: '#F0F4FF',
          100: '#E0E9FF',
          200: '#C7D7FE',
          300: '#A5BFFC',
          400: '#8BA2F8',
          500: '#385ADB', // Principal
          600: '#2D4BC7',
          700: '#243FA3',
          800: '#1E3485',
          900: '#1A2B6E',
        },
        secondary: {
          DEFAULT: '#62A0C2', // Azul Secundario
          50: '#F0F8FC',
          100: '#E0F1F8',
          200: '#C1E3F1',
          300: '#93CEE6',
          400: '#62A0C2', // Principal
          500: '#4A8AAF',
          600: '#3D7394',
          700: '#335F7A',
          800: '#2D5066',
          900: '#294356',
        },
        accent: {
          yellow: '#FFDC00', // Amarillo
          green: '#28A100',  // Verde
        },
        neutral: {
          white: '#FFFFFF',  // Blanco
          black: '#000000',  // Negro
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
