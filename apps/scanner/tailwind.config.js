/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        '5/4': '5 / 4',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        code: 'Recursive',
      },
      colors: {
        'phoenix-red': '#9B3A2A',
        'griffins-blue': '#013D61',
      },
    },
  },
  plugins: [],
};
