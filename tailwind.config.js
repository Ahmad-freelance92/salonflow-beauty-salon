/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#FBF8F3',
          100: '#F5EFE6',
          200: '#EBE0CE',
          300: '#DDCBAC',
          400: '#C9B189',
        },
        blush: {
          50: '#FDF5F3',
          100: '#FAE8E3',
          200: '#F4D0C7',
          300: '#EAB0A1',
          400: '#DC8B76',
        },
        gold: {
          400: '#C9A961',
          500: '#B8973F',
          600: '#9B7E32',
        },
        charcoal: {
          700: '#3A3530',
          800: '#2A2622',
          900: '#1C1916',
        },
        ivory: '#FBF8F3',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 20px -4px rgba(58, 53, 48, 0.08)',
        card: '0 8px 30px -6px rgba(58, 53, 48, 0.12)',
      },
    },
  },
  plugins: [],
};
