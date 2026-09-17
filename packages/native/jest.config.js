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
 * Three mappings are deliberate, and the first two exist because this is a
 * workspace rather than a single install:
 *
 * 1. React Native's preset resolves `react-native` from its own directory, where
 *    pnpm has placed no copy, so it falls through to the copy hoisted for the whole
 *    workspace. That copy was installed for another member and is bound to that
 *    member's React, while this package's own copy is bound to the React this
 *    package declares. Rendering through one React and calling a hook in another is
 *    an invalid hook call, and the failure names the component rather than the
 *    cause, so the platform is pinned to the copy this package installs. The
 *    regular expression is the preset's own, because a merged map keeps the entry
 *    that was there first and only its value is overridden.
 * 2. React itself is pinned to a single copy for the same reason: the hook
 *    dispatcher is stored on one module instance, so every module that calls a hook
 *    has to reach the same one, whichever package happened to require it.
 * 3. `@asheeui/shared` is mapped to its source because the workspace consumes it as
 *    TypeScript: mapping it keeps it inside the transform instead of inside the
 *    ignored `node_modules` tree.
 */
const path = require("node:path");

module.exports = {
  preset: "@react-native/jest-preset",
  rootDir: ".",
  testMatch: ["<rootDir>/src/**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^react-native($|/.*)": `${path.dirname(require.resolve("react-native"))}/$1`,
    "^react$": require.resolve("react"),
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
