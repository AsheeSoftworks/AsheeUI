/**
 * The Tailwind preset `@asheeui/native` is styled by.
 *
 * A native consumer needs three things in its Tailwind configuration, and until now it
 * had to state all three by hand, in every project:
 *
 * 1. **NativeWind's own preset**, which is what turns a Tailwind class into a native
 *    style rather than a CSS rule.
 * 2. **The eight semantic colour roles** the components reference by name —
 *    `bg-background`, `text-foreground`, `bg-primary`, `border-border`,
 *    `bg-secondary/40`. Without them a class such as `bg-background` compiles to
 *    nothing, silently.
 * 3. **The package's own compiled modules in the consumer's `content`.** Tailwind only
 *    compiles a class it can read in a file it is allowed to scan, and the framework's
 *    class strings live in *this* package's `dist`, outside the application's project
 *    directory.
 *
 * `content` is exported as well as declared, because of a Tailwind v3 rule: a preset's
 * `content` is **not** merged into a configuration that states its own — the consumer's
 * list replaces it. So the documented setup spreads this array into the application's
 * own list:
 *
 * ```js
 * // tailwind.config.js
 * const asheeui = require("@asheeui/native/tailwind-preset");
 *
 * module.exports = {
 *   presets: [asheeui],
 *   // The application's own content patterns, then the framework's — already absolute.
 *   content: [...APPLICATION_CONTENT, ...asheeui.content],
 * };
 * ```
 *
 * **Why the glob is absolute rather than a relative path.** The installed location of a
 * package is not `node_modules/@asheeui/native`: pnpm, Bun's isolated installs and npm
 * with a differing peer set all place it under a content-addressed directory
 * (`node_modules/.bun/@asheeui+native@2.6.0+<peer-hash>/node_modules/@asheeui/native`),
 * and how many directories up that is depends on how deeply the application itself is
 * nested. A relative glob is therefore a guess, and a wrong guess produces no styling
 * and no error. `__dirname` is not a guess: it is where this file was loaded from,
 * which is the package, wherever the package manager decided to put it.
 *
 * **The roles are variables, not colours.** Each role compiles to
 * `rgb(var(--ashee-<role>) / <alpha-value>)`, which is what `@asheeui/web`'s stylesheet
 * does with its `--color-*` block: the class names the theme, and the theme supplies the
 * value at render time. On the platform the value comes from `AsheeNativeProvider`, which
 * resolves the configuration's `color` and `defaultTheme` through `@asheeui/core` and
 * applies the result with NativeWind's `vars()` — so the palette is the application's,
 * stated once for both renderers, and `defaultTheme: "system"` follows the device's colour
 * scheme.
 *
 * That is why the preset states no colour values of its own: a hex here would be a second
 * palette, and it would win over the runtime one. An application that wants a build-time
 * palette can still state `theme.extend.colors`; the documentation records the cost, which
 * is that an overridden role no longer reads the theme.
 */

const path = require("node:path");

/**
 * Where this package's compiled class strings are.
 *
 * The published tree carries `dist`, and every component's class dictionary is a static
 * string in it, so scanning it is the whole requirement: no `src` is shipped.
 *
 * The separators are normalised to forward slashes so the glob is the same string on every
 * platform. Tailwind normalises them itself before it reads a path, but a consumer's tooling
 * (a test that asserts the framework is in `content`, a log line, a dedupe) sees the raw
 * string, and a Windows backslash there is a different string for the same file.
 */
const frameworkClasses = [
  path.join(__dirname, "dist", "**", "*.js").replace(/\\/g, "/"),
];

/**
 * The eight roles the components reference, each as the custom property it reads.
 *
 * The names are the ones `@asheeui/core` states as `PALETTE_ROLES` and the provider applies
 * as `--ashee-<role>`; the `<alpha-value>` placeholder is what keeps `bg-secondary/40` and
 * `bg-primary/10` working, because the alpha comes from the class rather than from the
 * value.
 */
const PALETTE_ROLES = [
  "background",
  "foreground",
  "primary",
  "secondary",
  "border",
  "danger",
  "warning",
  "success",
];

const colors = Object.fromEntries(
  PALETTE_ROLES.map((role) => [
    role,
    `rgb(var(--ashee-${role}) / <alpha-value>)`,
  ]),
);

module.exports = {
  // NativeWind's preset is what compiles for the platform; it is stated here so a
  // consumer cannot have this half of the setup without it.
  presets: [require("nativewind/preset")],
  content: frameworkClasses,
  theme: {
    extend: {
      colors,
    },
  },
};
