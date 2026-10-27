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
 * (`node_modules/.bun/@asheeui+native@2.5.0+<peer-hash>/node_modules/@asheeui/native`),
 * and how many directories up that is depends on how deeply the application itself is
 * nested. A relative glob is therefore a guess, and a wrong guess produces no styling
 * and no error. `__dirname` is not a guess: it is where this file was loaded from,
 * which is the package, wherever the package manager decided to put it.
 *
 * **Why these values are hex.** The framework's own light palette, copied from
 * `defaultColorConfig.light` in `@asheeui/core` (a test keeps the copy honest). Tailwind
 * applies an opacity modifier such as `bg-secondary/40` by converting the colour to a
 * channel triplet; a role defined as `rgb(var(--x))` without an `<alpha-value>`
 * placeholder, or as a bare `var(...)`, silently produces no style instead. Plain hex is
 * the form the framework's own class dictionary can always read.
 *
 * An application with its own palette overrides these in its own `theme.extend.colors`;
 * a value stated there wins over this preset, so only `primary` and the application's
 * own surfaces usually need saying.
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
 * The eight roles the components reference, at the framework's own light values.
 *
 * The same eight `@asheeui/web` resolves from its `--ashee-*` custom properties, so an
 * application that renders both platforms states one palette and gets one design
 * language. `border` is a role and not a shade of `foreground` because the components
 * state `border-border`, which needs a colour named `border`.
 */
const colors = {
  background: "#ffffff",
  foreground: "#000000",
  primary: "#2563eb",
  secondary: "#f3f4f6",
  border: "#d5d5d5",
  danger: "#dc2626",
  warning: "#d97706",
  success: "#16a34a",
};

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
