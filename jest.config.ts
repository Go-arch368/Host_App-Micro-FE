
export default {
  preset: "ts-jest/presets/default-esm", // Use ESM preset for TypeScript
  testEnvironment: "jest-environment-jsdom", // Ensure this matches the installed module
  moduleNameMapper: {
    "^@config/env$": "<rootDir>/src/__tests__/mocks/configEnvMock.ts",
    "^.+\\.(css|scss)$": "identity-obj-proxy", // Correct syntax for mocking CSS/SCSS imports
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"], // Treat TypeScript files as ESM
  moduleFileExtensions: ["js", "ts", "tsx", "json", "node"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { isolatedModules: true }], // Skip type checking
    "^.+\\.tsx$": ["ts-jest", { isolatedModules: true }], // Skip type checking for .tsx files
  },
  testMatch: ["**/__tests__/**/*.(test|spec).tsx"], // Simplified pattern to match test files
  collectCoverage: true,
  coverageDirectory: "coverage",
  transformIgnorePatterns: ["node_modules"], // Ignore transformations for node_modules
  setupFilesAfterEnv: ["./jest.setup.ts"],
};