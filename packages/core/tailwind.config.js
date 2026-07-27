/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../ai-growth-command-center/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          900: '#09090b',
          800: '#0f0f13',
          700: '#18181b',
          600: '#27272a',
        },
        brand: {
          purple: {
            400: '#a855f7',
            500: '#7c3aed',
            700: '#6d28d9',
            900: '#4c1d95',
          },
          blue: {
            400: '#60a5fa',
            500: '#3b82f6',
          },
        },
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
