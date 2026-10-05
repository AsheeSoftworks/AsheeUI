import { describe, expect, it } from "vitest";
import type { AccordionSizeKey, AccordionVariant } from "./accordion-config";
import {
  ACCORDION_CONTENT_SIZE_CLASS,
  ACCORDION_HEADER_SIZE_CLASS,
  ACCORDION_VARIANT_CONTAINER_CLASS,
  ACCORDION_VARIANT_ITEM_CLASS,
  NATIVE_ACCORDION_DIVIDER_CLASS,
  NATIVE_ACCORDION_INDICATOR_GLYPH,
  NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS,
  NATIVE_ACCORDION_VARIANT_ITEM_CLASS,
} from "./accordion-styles";

/** The densities an accordion can be. */
const DENSITIES: AccordionSizeKey[] = ["sm", "md", "lg"];

/** The visual styles an accordion can take. */
const VARIANTS: AccordionVariant[] = [
  "bordered",
  "separated",
  "ghost",
  "flush",
];

describe("the accordion's scale", () => {
  it("describes the header and the content at every density", () => {
    expect(Object.keys(ACCORDION_HEADER_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
    expect(Object.keys(ACCORDION_CONTENT_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("pads the header on every side and the content only under its top", () => {
    // A header is a target the reader presses, so it carries its own padding; the
    // content sits under the header and is padded only where the header does not reach.
    for (const density of DENSITIES) {
      expect(ACCORDION_HEADER_SIZE_CLASS[density]).toMatch(/px-\S+ py-\S+/);
      expect(ACCORDION_CONTENT_SIZE_CLASS[density]).toMatch(/px-\S+ pb-\S+/);
    }
  });
});

describe("the accordion's variants", () => {
  it("describes every variant on both renderers", () => {
    for (const map of [
      ACCORDION_VARIANT_CONTAINER_CLASS,
      ACCORDION_VARIANT_ITEM_CLASS,
      NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS,
      NATIVE_ACCORDION_VARIANT_ITEM_CLASS,
    ]) {
      expect(Object.keys(map).sort()).toEqual([...VARIANTS].sort());
    }
  });

  it("draws the grouped variants with a border and the separated ones with a gap", () => {
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.bordered).toContain("border");
    expect(NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS.bordered).toContain(
      "border",
    );
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.separated).toContain("space-y");
    expect(NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS.separated).toContain("gap");
  });

  it("keeps the flush variant free of borders and dividers on both renderers", () => {
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.flush).not.toContain("divide-y");
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.flush).not.toContain("border");
    expect(NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS.flush).not.toContain(
      "border",
    );
    expect(ACCORDION_VARIANT_ITEM_CLASS.flush).not.toContain("border");
    expect(NATIVE_ACCORDION_VARIANT_ITEM_CLASS.flush).not.toContain("border");
  });

  it("states the divider an item wears on the platform, where the web states it on the container", () => {
    // The web reaches between its children with `divide-y`; the platform has no such rule
    // and gives the item the divider it wears instead.
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.bordered).toContain("divide-y");
    expect(NATIVE_ACCORDION_DIVIDER_CLASS).toContain("border-t");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [
      ACCORDION_VARIANT_CONTAINER_CLASS,
      ACCORDION_VARIANT_ITEM_CLASS,
      NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS,
      NATIVE_ACCORDION_VARIANT_ITEM_CLASS,
    ]) {
      for (const value of Object.values(map)) {
        expect(value).not.toContain("undefined");
      }
    }

    expect(NATIVE_ACCORDION_INDICATOR_GLYPH.length).toBeGreaterThan(0);
  });
});
