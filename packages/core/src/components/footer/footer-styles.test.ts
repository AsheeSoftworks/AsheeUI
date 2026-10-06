import { describe, expect, it } from "vitest";
import type { FooterVariant } from "./footer-config";
import {
  FOOTER_BOTTOM_CLASS,
  FOOTER_BOTTOM_LINKS_CLASS,
  FOOTER_BRAND_COLUMN_CLASS,
  FOOTER_GROUP_CLASS,
  FOOTER_GROUPS_CLASS,
  FOOTER_LINK_CLASS,
  FOOTER_LIST_CLASS,
  FOOTER_SOCIAL_ROW_CLASS,
  FOOTER_TOP_CLASS,
  FOOTER_VARIANT_CLASS,
  NATIVE_FOOTER_BOTTOM_CLASS,
  NATIVE_FOOTER_GROUPS_CLASS,
  NATIVE_FOOTER_LINK_CLASS,
  NATIVE_FOOTER_SOCIAL_ROW_CLASS,
  NATIVE_FOOTER_TOP_CLASS,
  NATIVE_FOOTER_VARIANT_CLASS,
} from "./footer-styles";

/** The surfaces a footer can take. */
const VARIANTS: FooterVariant[] = ["solid", "muted", "bordered"];

describe("the footer's surface", () => {
  it("describes every treatment on both platforms", () => {
    expect(Object.keys(FOOTER_VARIANT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
    expect(Object.keys(NATIVE_FOOTER_VARIANT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
  });

  it("draws the separator above the bordered footer on both platforms", () => {
    expect(FOOTER_VARIANT_CLASS.bordered).toContain("border-t border-border");
    expect(NATIVE_FOOTER_VARIANT_CLASS.bordered).toContain(
      "border-t border-border",
    );
  });

  it("keeps the solid footer on the page background on both platforms", () => {
    expect(FOOTER_VARIANT_CLASS.solid).toBe("bg-background");
    expect(NATIVE_FOOTER_VARIANT_CLASS.solid).toBe("bg-background");
  });
});

describe("the footer's regions", () => {
  it("turns the upper region into a row at a breakpoint on the web and keeps it stacked on the platform", () => {
    expect(FOOTER_TOP_CLASS).toContain("lg:flex-row");
    expect(NATIVE_FOOTER_TOP_CLASS).not.toContain("lg:");
    // The platform's groups carry the wrapping instead: a footer that wrapped nothing would
    // run its columns off the side of a phone.
    expect(FOOTER_GROUPS_CLASS).toContain("flex-wrap");
    expect(NATIVE_FOOTER_GROUPS_CLASS).toContain("flex-wrap");
  });

  it("keeps the brand column above its groups on both platforms", () => {
    expect(FOOTER_BRAND_COLUMN_CLASS).toContain("flex-col");
    expect(FOOTER_GROUP_CLASS).toContain("flex-col");
    expect(FOOTER_LIST_CLASS).toContain("flex-col");
    expect(NATIVE_FOOTER_TOP_CLASS).toContain("w-full");
  });

  it("separates the lower region from the upper one on both platforms", () => {
    expect(FOOTER_BOTTOM_CLASS).toContain("border-t border-border");
    expect(NATIVE_FOOTER_BOTTOM_CLASS).toContain("border-t border-border");
  });
});

describe("the footer's links", () => {
  it("keeps one link style on both platforms", () => {
    expect(FOOTER_LINK_CLASS).toContain("text-sm");
    expect(NATIVE_FOOTER_LINK_CLASS).toBe("text-sm text-foreground/70");
  });

  it("keeps the legal and social rows wrapping on both platforms", () => {
    expect(FOOTER_BOTTOM_LINKS_CLASS).toContain("flex-wrap");
    expect(FOOTER_SOCIAL_ROW_CLASS).toContain("flex items-center");
    expect(NATIVE_FOOTER_SOCIAL_ROW_CLASS).toContain("flex-row");
  });
});
