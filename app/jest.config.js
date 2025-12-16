module.exports = {
  collectCoverageFrom: ["src/presenters/**/*.{js,jsx,ts,tsx}", "src/core/useCases/**/*.{js,jsx,ts,tsx}"],
  preset: "ts-jest",
  testRegex: ["(/src/(presenters|core/useCases/)(.*)\\.(test|spec))\\.(ts|js|tsx|jsx)$"],
  coverageReporters: [
    "json-summary",
    "lcov",
    "text-summary", // plus any other reporters, e.g. "lcov", "text", "text-summary"
  ],
  testEnvironment: "jsdom",
  coverageThreshold: {
    global: {
      branches: 72.09,
      functions: 74.48,
      lines: 83.66,
      statements: 81.75,
    },
  },
};
