import { describe, expect, it } from "vitest";
import {
  SECTION_BLOCK_HEADING_ROLE,
  type SectionBlockHeadingSize,
} from "./section-block";

const _SIZES: SectionBlockHeadingSize[] = ["md", "lg", "xl"];

describe("a band's heading element", () => {
  it("keeps the visual step each size asks for", () => {
    expect(SECTION_BLOCK_HEADING_ROLE).toEqual({
      md: "heading-lg",
      lg: "heading-xl",
      xl: "display",
    });
  });
});
