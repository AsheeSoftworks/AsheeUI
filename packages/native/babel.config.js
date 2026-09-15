/**
 * Babel configuration for the native package.
 *
 * React Native's own preset is used, unchanged: it carries the Flow and JSX
 * transforms, the platform resolution React Native depends on, and the TypeScript
 * transform this package's source needs. Replacing it with a web-oriented preset
 * would mean maintaining the difference by hand.
 *
 * The package is CommonJS for tooling purposes even though its source is written
 * with ES module syntax, because React Native's test and bundling toolchain is
 * CommonJS first. Fighting that would trade platform correctness for uniformity,
 * which the framework's priority order does not allow.
 */
module.exports = {
  presets: ["module:@react-native/babel-preset"],
};
