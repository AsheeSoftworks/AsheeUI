/**
 * Babel configuration for the Puck package.
 *
 * React Native's own preset is used, unchanged, because the native half of this
 * package is compiled and tested with the platform's toolchain — the same preset the
 * native package uses. A web-oriented preset would erase the platform transforms the
 * native entry depends on, and the two halves share one source tree.
 *
 * The package is CommonJS for tooling purposes even though its source is written with
 * ES module syntax, because React Native's test and bundling toolchain is CommonJS
 * first.
 */
module.exports = {
  presets: ["module:@react-native/babel-preset"],
};
