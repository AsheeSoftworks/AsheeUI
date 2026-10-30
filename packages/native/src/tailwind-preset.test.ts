/**
 * Tests for the Tailwind preset the package ships.
 *
 * The preset exists so a consumer states one line instead of three, so what the tests
 * assert is the three things it took off the consumer's hands: NativeWind's own preset is
 * in the chain, the framework's compiled modules are in `content` as an absolute glob
 * rooted at this package, and every colour role the components reference is stated — as the
 * custom property the provider paints, not as a colour, because the palette is the
 * application's and comes from the configuration.
 *
 * The role list is compared with `PALETTE_ROLES` in `@asheeui/core`, which is the list the
 * provider writes variables for, plus the one token that is not a palette role: `on-solid`,
 * the ink over a saturated fill. A role added to the framework and not to this preset would
 * compile to nothing and paint with no style at all, which is the failure the preset exists
 * to prevent.
 *
 * The preset is JavaScript rather than TypeScript because it is loaded by Tailwind's
 * CommonJS config loader inside Metro, which is why it is required here instead of
 * imported.
 */

import { join } from "node:path";
import { PALETTE_ROLES } from "@asheeui/core";

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

  it("states every role the framework paints, plus the shared on-solid token", () => {
    expect(Object.keys(preset.theme?.extend?.colors ?? {}).sort()).toEqual(
      [...PALETTE_ROLES, "on-solid"].sort(),
    );
  });

  it("states a role as the custom property the provider sets", () => {
    for (const role of [...PALETTE_ROLES, "on-solid"]) {
      // The `<alpha-value>` placeholder is what keeps `bg-secondary/40` working: the alpha
      // comes from the class, and the value comes from the theme.
      expect(preset.theme?.extend?.colors?.[role]).toBe(
        `rgb(var(--ashee-${role}) / <alpha-value>)`,
      );
    }
  });
});
