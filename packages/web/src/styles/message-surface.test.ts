/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import {
  type MessageVariant,
  resolveMessageVariant,
  type Variant,
} from "@asheeui/core";
import { describe, expect, it } from "vitest";

/** The treatments a message surface can wear. */
const VARIANTS: MessageVariant[] = ["solid", "faded", "bordered", "ghost"];

/** Every treatment a component's `variant` option can name. */
const EVERY_VARIANT: Variant[] = [...VARIANTS, "underlined"];

describe("the treatment a message surface wears", () => {
  it("resolves the one treatment a message does not have to its nearest equivalent", () => {
    // A consumer can set a global `underlined` for the components that have it, and a
    // message has to answer with something a message can be.
    expect(resolveMessageVariant("underlined")).toBe("bordered");
  });

  it("leaves every treatment a message does have alone", () => {
    for (const variant of VARIANTS) {
      expect(resolveMessageVariant(variant)).toBe(variant);
    }
  });

  it("answers every treatment a configuration can name, so nothing is left unmapped", () => {
    for (const variant of EVERY_VARIANT) {
      expect(VARIANTS).toContain(resolveMessageVariant(variant));
    }
  });
});
