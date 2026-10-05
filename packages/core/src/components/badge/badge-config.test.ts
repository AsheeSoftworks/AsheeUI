import { describe, expect, it } from "vitest";
import type { Variant } from "../../shared/variant";
import { type BadgeVariant, resolveBadgeVariant } from "./badge-config";

/** The treatments the badge's contract lets it express. */
const EXPRESSIBLE: BadgeVariant[] = ["solid", "faded", "bordered", "ghost"];

/** Every treatment the cascade can produce, including the one a badge cannot draw. */
const EVERY_TREATMENT: Variant[] = [...EXPRESSIBLE, "underlined"];

describe("resolveBadgeVariant", () => {
  it("passes every treatment a badge can express through unchanged", () => {
    for (const variant of EXPRESSIBLE) {
      expect(resolveBadgeVariant(variant)).toBe(variant);
    }
  });

  it("lands the underlined treatment, which a badge has no baseline for, on the bordered one", () => {
    expect(resolveBadgeVariant("underlined")).toBe("bordered");
  });

  it("answers with a treatment the badge's class maps are keyed by, for every input", () => {
    for (const variant of EVERY_TREATMENT) {
      expect(EXPRESSIBLE).toContain(resolveBadgeVariant(variant));
    }
  });
});
