/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#2E7D32',
          orange: '#F57C00',
          yellow: '#FDD835',
          blue: '#0288D1',
        }
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
      }
    },
  },
  plugins: [],
}