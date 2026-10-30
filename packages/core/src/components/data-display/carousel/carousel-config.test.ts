import { describe, expect, it } from "vitest";
import type { Variant } from "../../../shared/variant";
import {
  type CarouselVariant,
  resolveCarouselVariant,
} from "./carousel-config";

/** The frames the carousel can express, which are the variants a consumer may state. */
const EXPRESSIBLE: CarouselVariant[] = ["bordered", "ghost"];

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

  it("lands a treatment a plain JavaScript consumer invents on the default frame", () => {
    // The type is a promise to TypeScript; a JSON configuration can still carry any string.
    expect(resolveCarouselVariant("outline" as unknown as Variant)).toBe(
      "bordered",
    );
  });
});
