/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        norwester: ["Norwester"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        // Text outline utility
        ".text-outline": {
          "text-shadow":
            "-1px -1px 0 #000," +
            "1px -1px 0 #000," +
            "-1px 1px 0 #000," +
            "1px 1px 0 #000",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
