/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Azul ultramarino (Bandera Dominicana)
        primary: {
          50: '#E6EEF7',
          100: '#C9DBED',
          200: '#A9C0DA',
          300: '#8AA6C8',
          400: '#6A8CC0',
          500: '#335997',
          600: '#002D62', // Principal (Ultramarino)
          700: '#002552',
          800: '#001F45',
          900: '#001736',
        },
        // Secondary - Verde éxito
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#10b981', // Principal
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Warning - Amarillo advertencia
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Principal
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Danger - Rojo peligro
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Principal
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
    },
  },
  plugins: [],
};