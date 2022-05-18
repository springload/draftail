module.exports = {
  // https://github.com/thibaudcolas/stylelint-config-cookbook
  extends: "@thibaudcolas/stylelint-config-cookbook",
  rules: {
    "property-blacklist": [
      // Disallow positioning with physical properties. Use logical ones instead.
      "/left/",
      "/right/",
      "/float/",
      "/clear/",
    ],
    "declaration-property-value-whitelist": {
      // Only allow logical values.
      "text-align": ["start", "end", "center"],
    },
  },
};
