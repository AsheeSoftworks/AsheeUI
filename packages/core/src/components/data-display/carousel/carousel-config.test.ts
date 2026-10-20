import { describe, expect, it } from "vitest";
import type { Variant } from "../../../shared/variant";
import {
  type CarouselVariant,
  resolveCarouselVariant,
} from "./carousel-config";
import { CAROUSEL_VARIANT_CLASS } from "./carousel-styles";

/** The frames the carousel's contract lets it draw. */
const EXPRESSIBLE: CarouselVariant[] = ["bordered", "ghost"];

/** Every treatment the cascade can produce, including the ones the carousel cannot draw. */
const EVERY_TREATMENT: Variant[] = [
  "solid",
  "bordered",
  "ghost",
  "faded",
  "underlined",
];

describe("resolveCarouselVariant", () => {
  it("passes the carousel's own frames through unchanged", () => {
    for (const variant of EXPRESSIBLE) {
      expect(resolveCarouselVariant(variant)).toBe(variant);
    }
  });

  it("lands the filled treatment on the filled frame and the rest on the bordered one", () => {
    expect(resolveCarouselVariant("solid")).toBe("bordered");
    expect(resolveCarouselVariant("faded")).toBe("bordered");
    expect(resolveCarouselVariant("underlined")).toBe("bordered");
  });

  it("never answers with undefined for any treatment the cascade can produce", () => {
    for (const treatment of EVERY_TREATMENT) {
      const frame = resolveCarouselVariant(treatment);

      expect(EXPRESSIBLE).toContain(frame);
      expect(CAROUSEL_VARIANT_CLASS[frame]).toBeTypeOf("string");
    }
  });

  it("lands a treatment a plain JavaScript consumer invents on the default frame", () => {
    // The type is a promise to TypeScript; a JSON configuration can still carry any string.
    expect(resolveCarouselVariant("outline" as unknown as Variant)).toBe(
      "bordered",
    );
  });
});
