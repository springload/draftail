module.exports = {
  // https://github.com/torchbox/stylelint-config-torchbox
  extends: "stylelint-config-torchbox",
  rules: {
    "property-disallowed-list": [
      // Disallow positioning with physical properties. Use logical ones instead.
      "/left/",
      "/right/",
      "/float/",
      "/clear/",
    ],
    "selector-class-pattern": null,
    "declaration-property-value-allowed-list": {
      // Only allow logical values.
      "text-align": ["start", "end", "center"],
    },
  },
};
