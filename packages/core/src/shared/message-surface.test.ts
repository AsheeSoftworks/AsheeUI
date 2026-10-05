import { describe, expect, it } from "vitest";
import type { ColorRole } from "../tokens";
import {
  type MessageVariant,
  NATIVE_MESSAGE_SURFACE_CLASS,
  NATIVE_MESSAGE_TEXT_CLASS,
  resolveMessageVariant,
} from "./message-surface";
import type { Variant } from "./variant";

/** The colour roles both platforms name. */
const COLOURS: ColorRole[] = [
  "none",
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
];

/** The treatments a message surface can wear. */
const VARIANTS: MessageVariant[] = ["solid", "faded", "bordered", "ghost"];

/** Every treatment a component's `variant` option can name. */
const EVERY_VARIANT: Variant[] = [...VARIANTS, "underlined"];

describe("the treatment a message surface wears", () => {
  it("resolves the one treatment a message does not have to its nearest equivalent", () => {
    // A consumer can set a global `underlined` for the components that have it, and a
    // message has to answer with something a message can be.
    expect(resolveMessageVariant("underlined")).toBe("bordered");
  });

  it("leaves every treatment a message does have alone", () => {
    for (const variant of VARIANTS) {
      expect(resolveMessageVariant(variant)).toBe(variant);
    }
  });

  it("answers every treatment a configuration can name, so nothing is left unmapped", () => {
    for (const variant of EVERY_VARIANT) {
      expect(VARIANTS).toContain(resolveMessageVariant(variant));
    }
  });
});

describe("the treatments a native message surface can wear", () => {
  it("describes every treatment and every colour role", () => {
    expect(Object.keys(NATIVE_MESSAGE_SURFACE_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
    expect(Object.keys(NATIVE_MESSAGE_TEXT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );

    for (const variant of VARIANTS) {
      expect(Object.keys(NATIVE_MESSAGE_SURFACE_CLASS[variant]).sort()).toEqual(
        [...COLOURS].sort(),
      );
      expect(Object.keys(NATIVE_MESSAGE_TEXT_CLASS[variant]).sort()).toEqual(
        [...COLOURS].sort(),
      );
    }
  });

  it("paints a filled surface's text on the surface rather than in the role's own colour", () => {
    // A primary icon on a primary fill is invisible, so a filled treatment states the
    // colour its text is read in.
    expect(NATIVE_MESSAGE_TEXT_CLASS.solid.primary).toBe("text-background");
    expect(NATIVE_MESSAGE_TEXT_CLASS.solid.danger).toBe("text-background");
    expect(NATIVE_MESSAGE_TEXT_CLASS.solid.warning).toBe("text-background");
    expect(NATIVE_MESSAGE_TEXT_CLASS.faded.primary).toBe("text-primary");
  });

  it("leaves an unfilled treatment's text in the role's own colour", () => {
    for (const variant of ["faded", "bordered", "ghost"] as MessageVariant[]) {
      for (const colour of COLOURS) {
        expect(NATIVE_MESSAGE_TEXT_CLASS[variant][colour]).toContain(
          colour === "none" || colour === "secondary" ? "foreground" : colour,
        );
      }
    }
  });

  it("draws every treatment of a role in that role's own hue", () => {
    for (const colour of COLOURS) {
      if (colour === "none") continue;

      for (const variant of VARIANTS) {
        expect(NATIVE_MESSAGE_SURFACE_CLASS[variant][colour]).toContain(colour);
      }
    }
  });

  it("keeps the neutral role neutral, so a message cannot borrow a colour it was not given", () => {
    for (const variant of VARIANTS) {
      expect(NATIVE_MESSAGE_SURFACE_CLASS[variant].none).not.toMatch(
        /primary|danger|warning|success/,
      );
      expect(NATIVE_MESSAGE_TEXT_CLASS[variant].none).toBe("text-foreground");
    }
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const variant of VARIANTS) {
      for (const colour of COLOURS) {
        const surface = NATIVE_MESSAGE_SURFACE_CLASS[variant][colour];
        const text = NATIVE_MESSAGE_TEXT_CLASS[variant][colour];

        expect(surface.length).toBeGreaterThan(0);
        expect(text.length).toBeGreaterThan(0);
        expect(surface).not.toContain("undefined");
        expect(text).not.toContain("undefined");
      }
    }
  });
});
