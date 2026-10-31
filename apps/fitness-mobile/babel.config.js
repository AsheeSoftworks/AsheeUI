/**
 * Expo's Babel configuration.
 *
 * NativeWind's JSX import source and Babel preset are its own requirements; the umbrella
 * adds nothing to them.
 */
module.exports = function babelConfig(api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
