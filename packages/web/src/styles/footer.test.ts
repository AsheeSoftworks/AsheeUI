/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { FOOTER_BOTTOM_CLASS, FOOTER_BOTTOM_LINKS_CLASS, FOOTER_BRAND_COLUMN_CLASS, FOOTER_GROUP_CLASS, FOOTER_GROUPS_CLASS, FOOTER_LINK_CLASS, FOOTER_LIST_CLASS, FOOTER_SOCIAL_ROW_CLASS, FOOTER_TOP_CLASS, FOOTER_VARIANT_CLASS } from "./footer";
import { type FooterVariant } from "@asheeui/core";

/** The surfaces a footer can take. */
const VARIANTS: FooterVariant[] = ["solid", "muted", "bordered"];

describe("the footer's surface", () => {
  it("describes every treatment on both platforms", () => {
    expect(Object.keys(FOOTER_VARIANT_CLASS).sort()).toEqual(
          [...VARIANTS].sort(),
        );
  });

  it("draws the separator above the bordered footer on both platforms", () => {
    expect(FOOTER_VARIANT_CLASS.bordered).toContain("border-t border-border");
  });

  it("keeps the solid footer on the page background on both platforms", () => {
    expect(FOOTER_VARIANT_CLASS.solid).toBe("bg-background");
  });

});

describe("the footer's regions", () => {
  it("turns the upper region into a row at a breakpoint on the web and keeps it stacked on the platform", () => {
    expect(FOOTER_TOP_CLASS).toContain("lg:flex-row");
    // The platform's groups carry the wrapping instead: a footer that wrapped nothing would
        // run its columns off the side of a phone.
        expect(FOOTER_GROUPS_CLASS).toContain("flex-wrap");
  });

  it("keeps the brand column above its groups on both platforms", () => {
    expect(FOOTER_BRAND_COLUMN_CLASS).toContain("flex-col");
    expect(FOOTER_GROUP_CLASS).toContain("flex-col");
    expect(FOOTER_LIST_CLASS).toContain("flex-col");
  });

  it("separates the lower region from the upper one on both platforms", () => {
    expect(FOOTER_BOTTOM_CLASS).toContain("border-t border-border");
  });

});

describe("the footer's links", () => {
  it("keeps one link style on both platforms", () => {
    expect(FOOTER_LINK_CLASS).toContain("text-sm");
  });

  it("keeps the legal and social rows wrapping on both platforms", () => {
    expect(FOOTER_BOTTOM_LINKS_CLASS).toContain("flex-wrap");
    expect(FOOTER_SOCIAL_ROW_CLASS).toContain("flex items-center");
  });

});
