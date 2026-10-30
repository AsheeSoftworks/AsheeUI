/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { HERO_CENTERED_CLASS, HERO_LAYOUT_CLASS, HERO_MEDIA_CLASS, HERO_MEDIA_FIRST_CLASS, HERO_TEXT_COLUMN_CLASS } from "./hero";
import { SECTION_BLOCK_DESCRIPTION_CLASS } from "./section-block";

describe("the hero's arrangement", () => {
  it("puts the text and the media beside each other on a wide window, on the web", () => {
    expect(HERO_LAYOUT_CLASS).toContain("grid");
    expect(HERO_LAYOUT_CLASS).toContain("lg:grid-cols-2");
  });

  it("keeps the same rhythm on both platforms", () => {
    // The web's grid gap and the platform's row gap are the same step of the spacing scale,
        // so a hero reads as one band wherever it is drawn.
        expect(HERO_LAYOUT_CLASS).toContain("gap-10");
    expect(HERO_TEXT_COLUMN_CLASS).toContain("flex-col");
  });

  it("moves the media across with an order class on the web and with its position on the platform", () => {
    expect(HERO_MEDIA_FIRST_CLASS).toBe("lg:order-first");
  });

});

describe("the hero's columns", () => {
  it("centres the text column when the hero is centred, on the web", () => {
    expect(HERO_CENTERED_CLASS).toContain("items-center");
    expect(HERO_CENTERED_CLASS).toContain("text-center");
  });

  it("leaves the text column as wide as the band's container, on the web", () => {
    // A measure on the column would cap the headline and the action row too, and would make
        // `containerSize` unobservable; the description keeps its own measure instead.
        expect(HERO_TEXT_COLUMN_CLASS).not.toContain("max-w-");
    expect(SECTION_BLOCK_DESCRIPTION_CLASS).toBe("max-w-2xl");
    expect(HERO_MEDIA_CLASS).toBe("min-w-0");
  });

});
