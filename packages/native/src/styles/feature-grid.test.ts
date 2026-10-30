/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import {
  NATIVE_FEATURE_CARD_BODY_CLASS,
  NATIVE_FEATURE_HEADING_CLASS,
  NATIVE_FEATURE_ICON_CLASS,
  NATIVE_FEATURE_ICON_TONE_CLASS,
} from "./feature-grid";

describe("the feature grid's badge", () => {
  it("draws a badge large enough to hold an icon on both platforms", () => {
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("w-10");
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("h-10");
  });

  it("gives the badge the same shape and the same accent on both platforms", () => {
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("rounded-md");
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("bg-primary/10");
  });

  it("states the icon's colour on the platform, because the badge draws it as a child", () => {
    expect(NATIVE_FEATURE_ICON_TONE_CLASS).toBe("text-primary");
  });
});

describe("a feature card's body", () => {
  it("keeps the icon, the title and the description in one column on both platforms", () => {
    expect(NATIVE_FEATURE_CARD_BODY_CLASS).toContain("flex-col");
  });

  it("states its own rhythm on each platform", () => {
    expect(NATIVE_FEATURE_CARD_BODY_CLASS).toContain("gap-2");
  });
});

describe("the heading above the grid", () => {
  it("keeps space between the heading and the cards on both platforms", () => {
    expect(NATIVE_FEATURE_HEADING_CLASS).toContain("mb-6");
  });
});
