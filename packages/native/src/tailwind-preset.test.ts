/**
 * Tests for the Tailwind preset the package ships.
 *
 * The preset exists so a consumer states one line instead of three, so what the tests
 * assert is the three things it took off the consumer's hands: NativeWind's own preset is
 * in the chain, the framework's compiled modules are in `content` as an absolute glob
 * rooted at this package, and the eight colour roles carry the framework's own values.
 *
 * The last one is a drift guard with a specific failure in mind. The same eight values
 * live in `defaultColorConfig.light` in `@asheeui/core`, which is what the web renderer
 * paints from; a native palette that quietly disagreed with it would mean one design
 * language rendering as two. The roles also have to be plain hex: Tailwind applies an
 * opacity modifier such as `bg-secondary/40` by splitting a colour into channels, and a
 * role written as `rgb(var(--x))` without an `<alpha-value>` placeholder compiles to
 * nothing at all.
 *
 * The preset is JavaScript rather than TypeScript because it is loaded by Tailwind's
 * CommonJS config loader inside Metro, which is why it is required here instead of
 * imported.
 */

import { join } from "node:path";
import { defaultColorConfig } from "@asheeui/core";

/** The shape of the preset this module reads. */
interface TailwindPreset {
  /** The presets it chains, which is where NativeWind's own preset has to be. */
  presets?: unknown[];

  /** The files a consumer spreads into its own `content`. */
  content?: string[];

  /** The roles the components reference. */
  theme?: { extend?: { colors?: Record<string, string> } };
}

const preset = require("../tailwind-preset.cjs") as TailwindPreset;

/** The eight roles, in the order the documentation lists them. */
const ROLES = [
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
  "background",
  "foreground",
  "border",
] as const;

describe("the native Tailwind preset", () => {
  it("chains NativeWind's preset, so a consumer cannot have half the setup", () => {
    expect(Array.isArray(preset.presets)).toBe(true);
    expect(preset.presets?.length).toBeGreaterThan(0);
  });

  it("states the framework's compiled modules as an absolute glob", () => {
    // Absolute, and rooted at this package: a relative path is a guess about the install
    // layout, and pnpm, Bun's isolated installs and npm each guess differently. The
    // separators are forward slashes on every platform, so the glob is one string.
    expect(preset.content).toEqual([
      join(__dirname, "..", "dist", "**", "*.js").replace(/\\/g, "/"),
    ]);
  });

  it("states every role the components reference", () => {
    expect(Object.keys(preset.theme?.extend?.colors ?? {}).sort()).toEqual(
      [...ROLES].sort(),
    );
  });

  it("takes the roles from the framework's own light palette", () => {
    for (const role of ROLES) {
      expect(preset.theme?.extend?.colors?.[role]).toBe(
        defaultColorConfig.light[role],
      );
    }
  });

  it("states a role in a form an opacity modifier can read", () => {
    // `bg-secondary/40` and `bg-primary/10` are in the framework's own class dictionary,
    // and Tailwind reads them only from a colour it can split into channels.
    for (const role of ROLES) {
      expect(preset.theme?.extend?.colors?.[role]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
