import { transform } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        textMain: "#303237",
        paperYellow: "#e0dacd",
        lightPaper: "#e7e5e1",
        oldPaper: "#D6CABC",
        oldPaperHover: "#d2c4b4",
        oldPaperActive: "#cbbba9",
        textSecondary: "#856959",
      },
      keyframes: {
        shuffle: {
          "0%": {
            transform: "rotate(0deg) translateX(0) scale(1)",
          },
          "50%": {
            transform: "rotate(5deg) translateX(105%) scale(0.95)",
          },
          "100%": {
            transform: "rotate(0deg) translateX(0)",
          },
        },
      },
      animation: {
        shuffle: "shuffle 1s ease-in-out",
      },
      transitionProperty: {
        zIndex: "z-index",
      },
    },
  },
  plugins: [],
};
