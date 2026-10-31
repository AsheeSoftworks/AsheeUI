/**
 * Jest configuration for the native smoke test.
 *
 * The package is platform-neutral, so its behaviour tests run under Vitest. This runner exists to
 * prove the same source renders through the native provider and the native components: it installs
 * React Native's preset, pins React and the platform to the copies this package installs, and maps
 * `asheeui` to the native umbrella entry. `testMatch` and Vitest's `exclude` keep the native file
 * out of the web runner.
 */
const path = require("node:path");

module.exports = {
  preset: "@react-native/jest-preset",
  rootDir: ".",
  testMatch: ["<rootDir>/src/**/*.native.test.ts?(x)"],
  moduleNameMapper: {
    "^react-native/setup-env$": `${path.dirname(require.resolve("react-native"))}/src/setup-env.js`,
    "^react-native/react-private-interface$": `${path.dirname(require.resolve("react-native"))}/src/react-private-interface.js`,
    "^react-native($|/.*)": `${path.dirname(require.resolve("react-native"))}/$1`,
    "^react$": require.resolve("react"),
    "^asheeui$": "<rootDir>/../ui/src/index.native.ts",
    "^@asheeui/native$": "<rootDir>/../native/src/index.ts",
    "^@asheeui/core$": "<rootDir>/../core/src/index.ts",
    "^@babel/runtime/(.*)$": `${path.dirname(require.resolve("@babel/runtime/package.json"))}/$1`,
  },
  transformIgnorePatterns: [
    "node_modules/(?!(\\.pnpm|(jest-)?react-native|@react-native(-community)?|react-native-css-interop|nativewind)/)",
  ],
};
