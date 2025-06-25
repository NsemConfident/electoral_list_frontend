/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#16423C',
        softLIght: '#205B52',
        mediumLight: '#2A7467',
        brightTeal: '#359082',
        accent: '#5FC0B0',
        light: '#41A99A',
        secondary: '#E9EFEC'
      }
    },
  },
  plugins: [],
};
