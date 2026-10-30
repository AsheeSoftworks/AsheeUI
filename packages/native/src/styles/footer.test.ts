/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import type { FooterVariant } from "@asheeui/core";
import {
  NATIVE_FOOTER_BOTTOM_CLASS,
  NATIVE_FOOTER_GROUPS_CLASS,
  NATIVE_FOOTER_LINK_CLASS,
  NATIVE_FOOTER_SOCIAL_ROW_CLASS,
  NATIVE_FOOTER_TOP_CLASS,
  NATIVE_FOOTER_VARIANT_CLASS,
} from "./footer";

/** The surfaces a footer can take. */
const VARIANTS: FooterVariant[] = ["solid", "muted", "bordered"];

describe("the footer's surface", () => {
  it("describes every treatment on both platforms", () => {
    expect(Object.keys(NATIVE_FOOTER_VARIANT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
  });

  it("draws the separator above the bordered footer on both platforms", () => {
    expect(NATIVE_FOOTER_VARIANT_CLASS.bordered).toContain(
      "border-t border-border",
    );
  });

  it("keeps the solid footer on the page background on both platforms", () => {
    expect(NATIVE_FOOTER_VARIANT_CLASS.solid).toBe("bg-background");
  });
});

describe("the footer's regions", () => {
  it("turns the upper region into a row at a breakpoint on the web and keeps it stacked on the platform", () => {
    expect(NATIVE_FOOTER_TOP_CLASS).not.toContain("lg:");
    expect(NATIVE_FOOTER_GROUPS_CLASS).toContain("flex-wrap");
  });

  it("keeps the brand column above its groups on both platforms", () => {
    expect(NATIVE_FOOTER_TOP_CLASS).toContain("w-full");
  });

  it("separates the lower region from the upper one on both platforms", () => {
    expect(NATIVE_FOOTER_BOTTOM_CLASS).toContain("border-t border-border");
  });
});

describe("the footer's links", () => {
  it("keeps one link style on both platforms", () => {
    expect(NATIVE_FOOTER_LINK_CLASS).toBe("text-sm text-foreground/70");
  });

  it("keeps the legal and social rows wrapping on both platforms", () => {
    expect(NATIVE_FOOTER_SOCIAL_ROW_CLASS).toContain("flex-row");
  });
});
