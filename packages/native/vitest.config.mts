import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for the native package's platform-free logic.
 *
 * Only a test that imports neither `react-native` nor the package's component
 * surface can run here. Everything that renders a component stays on Jest: React
 * Native ships Flow-annotated source rather than a bundle, and the platform's test
 * environment — the mocks for `View`, `Text`, `TextInput`, `NativeModules` and the
 * rest — is provided by `@react-native/jest-preset`, whose mocks are written against
 * Jest's module registry. The React Native Testing Library also declares Jest as a
 * peer dependency. A runner that satisfied none of that would be proving things
 * about the mock rather than about the platform, so the two runners are kept apart
 * instead: `include` here and `testPathIgnorePatterns` in `jest.config.js` name the
 * same file, so nothing runs twice.
 *
 * The extension is `.mts` rather than `.ts` because this package is CommonJS — its
 * platform build is `commonjs` — so a `.ts` config would be loaded as CommonJS while
 * being written as a module, which Vite warns about and plans to reject by default.
 *
 * Add a file here only when it imports nothing from the platform. If it reaches the
 * package's `src/index.ts` it reaches React Native, and it belongs on Jest.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/utils/resolve-length.test.ts"],
    globals: true,
    restoreMocks: true,
  },
});
