/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{tsx,ts,jsx,js}'],
  theme: {
    extend: {
      colors: {
        'griffins-blue': '#013d61',
        'pheonix-red': '#9b3a2a',
      },
      fontFamily: {
        mono: ['space-mono'],
      },
    },
  },
  plugins: [],
};
