module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.spec.ts"],
  coverageReporters: ["json", "lcov", "text"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
    "!src/__generated__/**",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};
