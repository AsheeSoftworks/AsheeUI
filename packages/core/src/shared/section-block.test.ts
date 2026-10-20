import { describe, expect, it } from "vitest";
import {
  SECTION_BLOCK_HEADING_ELEMENT,
  SECTION_BLOCK_HEADING_ROLE,
  type SectionBlockHeadingSize,
} from "./section-block";

const SIZES: SectionBlockHeadingSize[] = ["md", "lg", "xl"];

describe("a band's heading element", () => {
  it("covers every size", () => {
    expect(Object.keys(SECTION_BLOCK_HEADING_ELEMENT).sort()).toEqual(
      [...SIZES].sort(),
    );
  });

  it("defaults every size to a level below the page title", () => {
    // A band is a section of a page, never the page's own title: two bands on one page
    // must not produce two `h1`s. Raising the level is `titleAs` on the heading.
    for (const size of SIZES) {
      expect(SECTION_BLOCK_HEADING_ELEMENT[size], size).not.toBe("h1");
      expect(SECTION_BLOCK_HEADING_ELEMENT[size], size).toBe("h2");
    }
  });

  it("names a heading at every size, so a title never leaves the outline", () => {
    for (const size of SIZES) {
      expect(SECTION_BLOCK_HEADING_ELEMENT[size], size).toMatch(/^h[1-6]$/);
    }
  });

  it("keeps the visual step each size asks for", () => {
    expect(SECTION_BLOCK_HEADING_ROLE).toEqual({
      md: "heading-lg",
      lg: "heading-xl",
      xl: "display",
    });
  });
});
