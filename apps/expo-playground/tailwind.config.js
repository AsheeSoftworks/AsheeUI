/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.js", "./src/**/*.{ts,tsx}", "../../packages/native/src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#111827",
        primary: "#EA580C",
        secondary: "#F1F5F9",
        danger: "#DC2626",
        warning: "#D97706",
        success: "#16A34A",
      },
    },
  },
  plugins: [],
};
