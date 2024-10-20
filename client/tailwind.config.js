const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      textShadow: {
        'custom': '0 35px #fff',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      screens: {
        // => @media (max-width: 1279px) { ... }
        lg: { min: "925px" },
      },
      colors: {
        blueGray: {
          500: 'rgba(100, 116, 139, 1)', // El color original que mencionaste
        },
      },
    },
  },
  plugins: [
    flowbite,
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-custom': {
          'text-shadow': '0 35px #fff',
        }
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}