/**
 * The class dictionaries' tests, moved with them.
 *
 * These files state both renderers' maps side by side, which is how the two are kept in step.
 * The platform's half now lives in `@asheeui/native` (C1), and this is the only package that can
 * still read core's half, so the file came with it. C2 moves the web's half to `@asheeui/web`
 * and these assertions follow it there.
 */

import {
  NATIVE_FEATURE_CARD_BODY_CLASS,
  NATIVE_FEATURE_HEADING_CLASS,
  NATIVE_FEATURE_ICON_CLASS,
  NATIVE_FEATURE_ICON_TONE_CLASS,
} from "./feature-grid";
import {
  FEATURE_CARD_BODY_CLASS,
  FEATURE_HEADING_CLASS,
  FEATURE_ICON_CLASS,
} from "@asheeui/core";

describe("the feature grid's badge", () => {
  it("draws a badge large enough to hold an icon on both platforms", () => {
    expect(FEATURE_ICON_CLASS).toContain("size-10");
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("w-10");
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("h-10");
  });

  it("gives the badge the same shape and the same accent on both platforms", () => {
    expect(FEATURE_ICON_CLASS).toContain("rounded-md");
    expect(FEATURE_ICON_CLASS).toContain("bg-primary/10");
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("rounded-md");
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("bg-primary/10");
  });

  it("states the icon's colour on the platform, because the badge draws it as a child", () => {
    // On the web the badge's own text colour is inherited by an icon drawn in `currentColor`.
    // The platform's child view does not inherit it, so the tone is named beside the badge.
    expect(FEATURE_ICON_CLASS).toContain("text-primary");
    expect(NATIVE_FEATURE_ICON_TONE_CLASS).toBe("text-primary");
  });
});

describe("a feature card's body", () => {
  it("keeps the icon, the title and the description in one column on both platforms", () => {
    expect(FEATURE_CARD_BODY_CLASS).toContain("flex-col");
    expect(NATIVE_FEATURE_CARD_BODY_CLASS).toContain("flex-col");
  });

  it("states its own rhythm on each platform", () => {
    expect(FEATURE_CARD_BODY_CLASS).toContain("gap-3");
    expect(NATIVE_FEATURE_CARD_BODY_CLASS).toContain("gap-2");
  });
});

describe("the heading above the grid", () => {
  it("keeps space between the heading and the cards on both platforms", () => {
    expect(FEATURE_HEADING_CLASS).toBe("mb-10");
    expect(NATIVE_FEATURE_HEADING_CLASS).toContain("mb-6");
  });
});
