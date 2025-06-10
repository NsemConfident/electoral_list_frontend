/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#16423C',
        accent: '#6A9C89',
        light: '#C4DAD2',
        secondary: '#E9EFEC'
      }
    },
  },
  plugins: [],
};
