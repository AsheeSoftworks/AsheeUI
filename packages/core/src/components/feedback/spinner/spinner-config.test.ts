/**
 * The spinner's configured speed.
 *
 * The speed is stated once, as a CSS duration, and both renderers read it: the web writes it
 * into the animation, and the platform parses it into the duration its animator counts. A
 * consumer who finds it too brisk changes one option rather than two behaviours.
 *
 * The platform's parsing moved to `@asheeui/native` in C1 (`resolveSpinnerDurationMs`), because
 * a browser never parses the value — it hands the CSS duration to the animation as it is.
 */

import { describe, expect, it } from "vitest";
import { SPINNER_FALLBACK_SPEED } from "./spinner-config";

describe("SPINNER_FALLBACK_SPEED", () => {
  it("states a fallback both renderers can read: a CSS duration, not a number", () => {
    expect(SPINNER_FALLBACK_SPEED.endsWith("s")).toBe(true);
    expect(Number.parseFloat(SPINNER_FALLBACK_SPEED)).toBeGreaterThan(0);
  });
});
