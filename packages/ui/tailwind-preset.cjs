/**
 * The native Tailwind preset, reached through the umbrella package.
 *
 * `asheeui` routes an import to `@asheeui/native` on a React Native platform, so an
 * application that installs the umbrella never imports the native package by name — and
 * with pnpm, Bun's isolated installs or npm's nesting, it cannot reach a package that is
 * only the umbrella's dependency. This subpath is the seam: the preset is the native
 * package's own file, resolved from where the umbrella installed it, so an application
 * states one setup for whichever entry point it uses.
 *
 * The whole configuration lives next door, in `@asheeui/native/tailwind-preset`; this file
 * exists so a consumer of `asheeui` can name the preset without adding a second dependency
 * to its manifest.
 *
 * ```js
 * // tailwind.config.js
 * const asheeui = require("asheeui/tailwind-preset");
 *
 * module.exports = {
 *   presets: [asheeui],
 *   content: [...APPLICATION_CONTENT, ...asheeui.content],
 * };
 * ```
 */

module.exports = require("@asheeui/native/tailwind-preset");
