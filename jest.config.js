module.exports = {
  moduleNameMapper: {
    "\\.scss$": "<rootDir>/tests/styleMock.js",
  },
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  transform: {
    "\\.(js|ts|tsx)$": "ts-jest",
  },
  testEnvironment: "jsdom",
  collectCoverageFrom: ["<rootDir>/demo/**/*.js"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/es/", "/integration/"],
  coveragePathIgnorePatterns: ["<rootDir>/tests", "/examples/", "/.storybook/"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFiles: ["<rootDir>/tests/environment.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTest.js"],
};
