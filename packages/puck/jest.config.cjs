/**
 * Jest configuration for the Puck package's native half.
 *
 * The native entry is tested with the platform's own tooling rather than the web
 * suite: React Native's jest preset installs the platform mocks a native component
 * needs, and the React Native Testing Library queries the accessibility tree the way
 * a device renders it. The other half of the package runs under Vitest, because its
 * behaviour is DOM behaviour; the two runners are kept apart by `testMatch` and by
 * the Vitest configuration's `include`, so neither suite runs twice.
 *
 * Three mappings are deliberate, and they mirror the native package's own config:
 *
 * 1. React Native's preset resolves `react-native` from its own directory, where pnpm
 *    has placed no copy, so the platform is pinned to the copy this package installs.
 * 2. React itself is pinned to a single copy, because the hook dispatcher lives on one
 *    module instance and every module that calls a hook has to reach the same one.
 * 3. `@asheeui/core` and `@asheeui/native` are mapped to their source, because the
 *    workspace consumes them as TypeScript: mapping them keeps them inside the
 *    transform instead of inside the ignored `node_modules` tree.
 */
const path = require("node:path");

module.exports = {
  preset: "@react-native/jest-preset",
  rootDir: ".",
  testMatch: ["<rootDir>/src/native/**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^react-native($|/.*)": `${path.dirname(require.resolve("react-native"))}/$1`,
    "^react$": require.resolve("react"),
    "^@asheeui/core$": "<rootDir>/../core/src/index.ts",
    "^@asheeui/native$": "<rootDir>/../native/src/index.ts",
    "^@babel/runtime/(.*)$": `${path.dirname(require.resolve("@babel/runtime/package.json"))}/$1`,
  },
  // pnpm resolves every package through its store (`node_modules/.pnpm/...`), and
  // React Native ships source that has to be transformed rather than a compiled
  // bundle. Ignoring only the top level keeps the packages that need the transform
  // inside it.
  transformIgnorePatterns: [
    "node_modules/(?!(\\.pnpm|(jest-)?react-native|@react-native(-community)?|react-native-css-interop|nativewind)/)",
  ],
};
