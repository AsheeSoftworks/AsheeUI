/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";

import {
  FEATURE_CARD_BODY_CLASS,
  FEATURE_HEADING_CLASS,
  FEATURE_ICON_CLASS,
} from "./feature-grid";

describe("the feature grid's badge", () => {
  it("draws a badge large enough to hold an icon on both platforms", () => {
    expect(FEATURE_ICON_CLASS).toContain("size-10");
  });

  it("gives the badge the same shape and the same accent on both platforms", () => {
    expect(FEATURE_ICON_CLASS).toContain("rounded-md");
    expect(FEATURE_ICON_CLASS).toContain("bg-primary/10");
  });

  it("states the icon's colour on the platform, because the badge draws it as a child", () => {
    // On the web the badge's own text colour is inherited by an icon drawn in `currentColor`.
    // The platform's child view does not inherit it, so the tone is named beside the badge.
    expect(FEATURE_ICON_CLASS).toContain("text-primary");
  });
});

describe("a feature card's body", () => {
  it("keeps the icon, the title and the description in one column on both platforms", () => {
    expect(FEATURE_CARD_BODY_CLASS).toContain("flex-col");
  });

  it("states its own rhythm on each platform", () => {
    expect(FEATURE_CARD_BODY_CLASS).toContain("gap-3");
  });
});

describe("the heading above the grid", () => {
  it("keeps space between the heading and the cards on both platforms", () => {
    expect(FEATURE_HEADING_CLASS).toBe("mb-10");
  });
});
