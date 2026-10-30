/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import type { AccordionSizeKey, AccordionVariant } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import {
  ACCORDION_VARIANT_CONTAINER_CLASS,
  ACCORDION_VARIANT_ITEM_CLASS,
} from "./accordion";
import {
  ACCORDION_CONTENT_SIZE_CLASS,
  ACCORDION_HEADER_SIZE_CLASS,
} from "./portable";

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
    ]) {
      expect(Object.keys(map).sort()).toEqual([...VARIANTS].sort());
    }
  });

  it("draws the grouped variants with a border and the separated ones with a gap", () => {
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.bordered).toContain("border");
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.separated).toContain("space-y");
  });

  it("keeps the flush variant free of borders and dividers on both renderers", () => {
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.flush).not.toContain("divide-y");
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.flush).not.toContain("border");
    expect(ACCORDION_VARIANT_ITEM_CLASS.flush).not.toContain("border");
  });

  it("states the divider an item wears on the platform, where the web states it on the container", () => {
    // The web reaches between its children with `divide-y`; the platform has no such rule
    // and gives the item the divider it wears instead.
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.bordered).toContain("divide-y");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [
      ACCORDION_VARIANT_CONTAINER_CLASS,
      ACCORDION_VARIANT_ITEM_CLASS,
    ]) {
      for (const value of Object.values(map)) {
        expect(value).not.toContain("undefined");
      }
    }
  });
});
