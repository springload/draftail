module.exports = {
  parser: "babel-eslint",
  extends: [
    "plugin:@thibaudcolas/eslint-plugin-cookbook/recommended",
    "plugin:compat/recommended",
    "plugin:flowtype/recommended",
  ],
  plugins: ["flowtype"],
  rules: {
    "flowtype/space-after-type-colon": [0],
    "flowtype/generic-spacing": [0],
    "@thibaudcolas/cookbook/react/require-default-props": [
      "error",
      { forbidDefaultForRequired: false },
    ],
    "@thibaudcolas/cookbook/react/default-props-match-prop-types": [
      "error",
      { allowRequiredDefaults: true },
    ],
  },
  settings: {
    polyfills: ["promises"],
  },
  env: {
    jest: true,
  },
};
