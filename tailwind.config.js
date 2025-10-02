/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include paths to all files that contain NativeWind/Tailwind classes.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}