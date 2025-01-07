/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [
    // Background colors
    {
      pattern:
        /bg-(transparent|black|white|neutral|gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-[1-9]0{1,2})?$/,
    },
    {
      pattern: /bg-\[#(?:[0-9a-fA-F]{3}){1,2}\]/,
    },
    // Text colors
    {
      pattern:
        /text-(transparent|black|white|neutral|gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-[1-9]0{1,2})?$/,
    },
    {
      pattern: /text-\[#(?:[0-9a-fA-F]{3}){1,2}\]/,
    },
    // Border colors
    {
      pattern:
        /border-(transparent|black|white|neutral|gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-[1-9]0{1,2})?$/,
    },
    {
      pattern: /border-\[#(?:[0-9a-fA-F]{3}){1,2}\]/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        norwester: ["Norwester"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
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
