module.exports = {
  extends: ["torchbox/typescript"],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "react/default-props-match-prop-types": [
      "error",
      { allowRequiredDefaults: true },
    ],
  },
  overrides: [
    {
      files: ["*.stories.tsx", "*.story.tsx", "*.test.tsx", "tests/**/*"],
      rules: {
        "react/jsx-props-no-spreading": "off",
        "max-classes-per-file": "off",
        "jsx-a11y/label-has-associated-control": "off",
        // Don’t mandate typing for Storybook stories.
        // '@typescript-eslint/explicit-module-boundary-types': 0,
        // '@typescript-eslint/explicit-function-return-type': 0,
      },
    },
  ],
};
