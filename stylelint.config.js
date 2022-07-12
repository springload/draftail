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
    "scale-unlimited/declaration-strict-value": [
      ["color", "fill", "stroke", "/-color/"],
      {
        ignoreKeywords: [
          "currentColor",
          "inherit",
          "transparent",
          "initial",
          "none",
          "unset",
          "Canvas",
          "CanvasText",
          "LinkText",
          "VisitedText",
          "ActiveText",
          "ButtonFace",
          "ButtonText",
          "ButtonBorder",
          "Field",
          "FieldText",
          "Highlight",
          "HighlightText",
          "SelectedItem",
          "SelectedItemText",
          "Mark",
          "MarkText",
          "GrayText",
          "AccentColor",
          "AccentColorText",
        ],
      },
    ],
    "value-keyword-case": null,
  },
};
