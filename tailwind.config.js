/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FC5114',
          light: '#fd6d3d',
          dark: '#d9450f',
          muted: 'rgba(252, 81, 20, 0.1)',
        },
      },
      boxShadow: {
        'brand': '0 10px 40px -10px rgba(252, 81, 20, 0.3)',
        'brand-lg': '0 20px 50px -15px rgba(252, 81, 20, 0.4)',
      },
    },
  },
  plugins: [],
}
