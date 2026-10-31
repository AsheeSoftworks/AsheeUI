/**
 * Babel for the native smoke test.
 *
 * The package's source is shared, but React Native's test runner needs the platform preset to
 * transform the native components the source reaches. The web suite uses Vite's transform instead.
 */
module.exports = {
  presets: ["module:@react-native/babel-preset"],
};
