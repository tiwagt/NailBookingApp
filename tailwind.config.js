/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {colors: {
      'pastel-blue': '#e8f3eb', // Light pastel blue
      'pastel-purple': '#ec4899', // Light pastel purple
    },},
  },
  plugins: [],
};

