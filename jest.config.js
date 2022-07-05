module.exports = {
  moduleNameMapper: {
    "\\.scss$": "<rootDir>/tests/styleMock.js",
  },
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  transform: {
    "\\.(js|ts|tsx)$": "ts-jest",
  },
  testEnvironment: "jsdom",
  collectCoverageFrom: ["<rootDir>/src/**/*.{js,ts,tsx}"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/es/", "/integration/"],
  coveragePathIgnorePatterns: ["<rootDir>/tests", "/examples/", "/.storybook/"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFiles: ["<rootDir>/tests/environment.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTest.js"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};
