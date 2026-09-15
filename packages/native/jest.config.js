/**
 * Jest configuration for the native package.
 *
 * The native implementation is tested with the platform's own tooling rather than
 * the web package's: React Native's jest preset, which installs the platform mocks
 * a native component needs, and the React Native Testing Library, which queries a
 * tree the way a native application renders it. Sharing a runner with the web
 * package would mean mocking the platform away, and then the test would prove
 * nothing about the platform.
 *
 * `@asheeui/shared` is mapped to its source because the workspace consumes it as
 * TypeScript: mapping it keeps it inside the transform instead of inside the
 * ignored `node_modules` tree.
 */
module.exports = {
  preset: "@react-native/jest-preset",
  rootDir: ".",
  testMatch: ["<rootDir>/src/**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^@asheeui/shared$": "<rootDir>/../shared/src/index.ts",
  },
  // pnpm resolves every package through its store (`node_modules/.pnpm/...`), and
  // React Native ships source that has to be transformed rather than a compiled
  // bundle. Ignoring only the top level keeps the packages that need the transform
  // inside it, which is what lets the platform's own preset, its modules and the
  // native styling runtime load at all.
  transformIgnorePatterns: [
    "node_modules/(?!(\\.pnpm|(jest-)?react-native|@react-native(-community)?|react-native-css-interop|nativewind)/)",
  ],
};
