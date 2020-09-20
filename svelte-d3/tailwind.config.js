module.exports = {
  theme: {
    extend: {},
  },
  variants: {
    visibility: ["responsive", "hover", "focus"],
  },
  plugins: [require("@tailwindcss/typography")],
  purge: ["./src/**/*.html", "./src/**/*.svelte"],
};
