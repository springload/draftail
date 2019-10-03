module.exports = {
  moduleNameMapper: {
    "\\.scss$": "<rootDir>/tests/styleMock.js",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/es/", "/integration/"],
  coveragePathIgnorePatterns: ["<rootDir>/tests", "/examples/", "/.storybook/"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFiles: ["<rootDir>/tests/environment.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTest.js"],
};
