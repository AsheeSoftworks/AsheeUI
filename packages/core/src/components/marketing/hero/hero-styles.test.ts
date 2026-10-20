import { describe, expect, it } from "vitest";
import { SECTION_BLOCK_DESCRIPTION_CLASS } from "../../../shared/section-block";
import {
  HERO_CENTERED_CLASS,
  HERO_LAYOUT_CLASS,
  HERO_MEDIA_CLASS,
  HERO_MEDIA_FIRST_CLASS,
  HERO_TEXT_COLUMN_CLASS,
  NATIVE_HERO_BASE_CLASS,
  NATIVE_HERO_COLUMN_CLASS,
  NATIVE_HERO_MEDIA_CLASS,
  NATIVE_HERO_ROW_CLASS,
  NATIVE_HERO_TEXT_COLUMN_CLASS,
} from "./hero-styles";

describe("the hero's arrangement", () => {
  it("puts the text and the media beside each other on a wide window, on the web", () => {
    expect(HERO_LAYOUT_CLASS).toContain("grid");
    expect(HERO_LAYOUT_CLASS).toContain("lg:grid-cols-2");
  });

  it("states one arrangement on the platform and lets the component pick it", () => {
    // The platform has no class variants for a window, so both arrangements are complete
    // strings and the component chooses between them from the window it measures.
    expect(NATIVE_HERO_ROW_CLASS).not.toContain("lg:");
    expect(NATIVE_HERO_COLUMN_CLASS).not.toContain("lg:");
    expect(NATIVE_HERO_ROW_CLASS).toContain("flex-row");
    expect(NATIVE_HERO_COLUMN_CLASS).toContain("flex-col");
  });

  it("keeps the same rhythm on both platforms", () => {
    // The web's grid gap and the platform's row gap are the same step of the spacing scale,
    // so a hero reads as one band wherever it is drawn.
    expect(HERO_LAYOUT_CLASS).toContain("gap-10");
    expect(NATIVE_HERO_ROW_CLASS).toContain("gap-8");
    expect(HERO_TEXT_COLUMN_CLASS).toContain("flex-col");
    expect(NATIVE_HERO_TEXT_COLUMN_CLASS).toContain("gap-4");
  });

  it("moves the media across with an order class on the web and with its position on the platform", () => {
    expect(HERO_MEDIA_FIRST_CLASS).toBe("lg:order-first");
    // The platform's own layout has no order, so the component places the media first in
    // the tree instead; neither arrangement class carries an ordering of its own.
    expect(NATIVE_HERO_ROW_CLASS).not.toContain("order");
    expect(NATIVE_HERO_COLUMN_CLASS).not.toContain("order");
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

  it("fills the band on the platform, because the container states the width there", () => {
    expect(NATIVE_HERO_BASE_CLASS).toBe("w-full");
    expect(NATIVE_HERO_TEXT_COLUMN_CLASS).toContain("flex-1");
    expect(NATIVE_HERO_MEDIA_CLASS).toContain("flex-1");
  });
});
