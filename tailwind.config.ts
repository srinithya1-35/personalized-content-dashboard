import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6ED',
          200: '#F4ECE0',
          300: '#EAE0CF',
          400: '#DFCDB8',
        },
        lavender: {
          50: '#F7F5FC',
          100: '#EFEBF8',
          200: '#E1D9F2',
          300: '#CBBDE8',
          400: '#B09ADB',
          500: '#9474CB',
          600: '#7B56B5',
        },
        rose: {
          50: '#FDF7F8',
          100: '#F9ECEE',
          200: '#F4D6DB',
          300: '#EAB5BF',
          400: '#DD8E9E',
          500: '#CA6B7F',
        },
        peach: {
          50: '#FFF9F5',
          100: '#FFF0E6',
          200: '#FFDFCC',
          300: '#FFC6A6',
          400: '#FFA57A',
          500: '#F78148',
        },
        sage: {
          50: '#F5F8F6',
          100: '#E6EFE8',
          200: '#D0E0D4',
          300: '#B2CCB8',
          400: '#8FB497',
          500: '#6D9977',
        },
        charcoal: {
          800: '#1F222A',
          850: '#191B22',
          900: '#14161C',
          950: '#0E1015',
        },
        plum: {
          800: '#251C2C',
          850: '#1E1624',
          900: '#17111C',
          950: '#100C14',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(0, 0, 0, 0.08)',
        'glow-lavender': '0 0 25px -5px rgba(167, 139, 250, 0.3)',
        'glow-rose': '0 0 25px -5px rgba(244, 114, 182, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
