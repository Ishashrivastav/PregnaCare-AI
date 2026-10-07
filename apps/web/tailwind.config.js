/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rosewater: {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffc9c9',
          300: '#ffa8a8',
          400: '#ff8787',
          500: '#f06595',
          600: '#e64980',
          700: '#d6336c',
          800: '#c2255c',
          900: '#a61e4d',
        },
        sage: {
          50: '#f4f9f6',
          100: '#e6f2eb',
          200: '#cfe5d8',
          300: '#abd2bd',
          400: '#81b89d',
          500: '#5e9d7e',
          600: '#488065',
          700: '#3a6652',
          800: '#305242',
          900: '#284437',
        },
        lavender: {
          50: '#f8f7ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        warm: {
          50: '#faf8f5',
          100: '#f5f1eb',
          200: '#ebe3d8',
          800: '#3e372e',
          900: '#2b261f',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(180, 140, 160, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(180, 140, 160, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
