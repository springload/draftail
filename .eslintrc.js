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
  },
  settings: {
    polyfills: ["promises"],
  },
  env: {
    jest: true,
  },
};
