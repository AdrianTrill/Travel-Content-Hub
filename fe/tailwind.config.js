/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6E2168',
          dark: '#340B37',
        },
        gray: {
          light: '#F8F9F9',
          lighter: '#FAFAFA',
          lightest: '#FCFCFB',
          border: '#DAE1E9',
          medium: '#5F6977',
          dark: '#545D6B',
          darker: '#3F3F46',
        },
        success: '#0F612D',
        warning: '#F5A00F',
        danger: '#FFB066',
        background: {
          light: '#EDE3E7',
          lighter: '#F7F1E9',
        },
      },
      boxShadow: {
        card: '0 2px 6px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
} 