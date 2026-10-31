/**
 * The native application's Tailwind configuration.
 *
 * The preset comes from the umbrella, which forwards the native renderer's own preset:
 * NativeWind's preset, the semantic colour roles, and the renderer's compiled modules in
 * `content`. The shared kit is scanned from its package.
 */
const asheeui = require("asheeui/tailwind-preset");

module.exports = {
  presets: [asheeui],
  content: [
    "./App.tsx",
    "./src/**/*.{ts,tsx}",
    "../fitness-shared/src/**/*.{ts,tsx}",
    ...asheeui.content,
  ],
};
