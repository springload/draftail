module.exports = {
  parser: "babel-eslint",
  extends: [
    "plugin:@thibaudcolas/eslint-plugin-cookbook/recommended",
    "plugin:compat/recommended",
  ],
  rules: {
    "@thibaudcolas/cookbook/react/jsx-filename-extension": "off",
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
