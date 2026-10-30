import { describe, expect, it } from "vitest";
import { FALLBACK_CARD_TREATMENT, resolveCardVariant } from "./card";

describe("which surface a card draws", () => {
  it("keeps a shared treatment as itself", () => {
    for (const treatment of [
      "solid",
      "faded",
      "bordered",
      "ghost",
      "underlined",
    ] as const) {
      expect(resolveCardVariant(treatment)).toBe(treatment);
    }
  });

  it("lands the web card's own surface names on the surface both cards draw", () => {
    // The web card publishes `elevated` and `flat`; a shared configuration can carry one,
    // and a device has no class behind either. Both are the filled surface.
    expect(resolveCardVariant("elevated")).toBe("solid");
    expect(resolveCardVariant("flat")).toBe("solid");
  });

  it("falls back to the bordered surface for a name it does not know", () => {
    // A plain JS or JSON configuration can name any string at runtime.
    expect(resolveCardVariant("unknown")).toBe(FALLBACK_CARD_TREATMENT);
    expect(resolveCardVariant("")).toBe("bordered");
  });
});
