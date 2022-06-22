module.exports = {
  rules: {
    "no-alert": [0],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
      },
    ],
  },
};
