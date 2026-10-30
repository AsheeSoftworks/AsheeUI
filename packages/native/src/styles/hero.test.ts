/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import {
  NATIVE_HERO_BASE_CLASS,
  NATIVE_HERO_COLUMN_CLASS,
  NATIVE_HERO_MEDIA_CLASS,
  NATIVE_HERO_ROW_CLASS,
  NATIVE_HERO_TEXT_COLUMN_CLASS,
} from "./hero";

describe("the hero's arrangement", () => {
  it("states one arrangement on the platform and lets the component pick it", () => {
    // The platform has no class variants for a window, so both arrangements are complete
    // strings and the component chooses between them from the window it measures.
    expect(NATIVE_HERO_ROW_CLASS).not.toContain("lg:");
    expect(NATIVE_HERO_COLUMN_CLASS).not.toContain("lg:");
    expect(NATIVE_HERO_ROW_CLASS).toContain("flex-row");
    expect(NATIVE_HERO_COLUMN_CLASS).toContain("flex-col");
  });

  it("keeps the same rhythm on both platforms", () => {
    expect(NATIVE_HERO_ROW_CLASS).toContain("gap-8");
    expect(NATIVE_HERO_TEXT_COLUMN_CLASS).toContain("gap-4");
  });

  it("moves the media across with an order class on the web and with its position on the platform", () => {
    // The platform's own layout has no order, so the component places the media first in
    // the tree instead; neither arrangement class carries an ordering of its own.
    expect(NATIVE_HERO_ROW_CLASS).not.toContain("order");
    expect(NATIVE_HERO_COLUMN_CLASS).not.toContain("order");
  });
});

describe("the hero's columns", () => {
  it("fills the band on the platform, because the container states the width there", () => {
    expect(NATIVE_HERO_BASE_CLASS).toBe("w-full");
    expect(NATIVE_HERO_TEXT_COLUMN_CLASS).toContain("flex-1");
    expect(NATIVE_HERO_MEDIA_CLASS).toContain("flex-1");
  });
});
