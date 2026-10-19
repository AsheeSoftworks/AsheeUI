import { describe, expect, it } from "vitest";
import {
  resolveSpinnerDurationMs,
  SPINNER_FALLBACK_SPEED,
} from "./spinner-config";

describe("resolveSpinnerDurationMs", () => {
  it("reads a duration stated in seconds as the milliseconds an animator counts", () => {
    expect(resolveSpinnerDurationMs("0.75s")).toBe(750);
    expect(resolveSpinnerDurationMs("2s")).toBe(2000);
    expect(resolveSpinnerDurationMs("1.5s")).toBe(1500);
  });

  it("leaves a duration already stated in milliseconds alone", () => {
    expect(resolveSpinnerDurationMs("500ms")).toBe(500);
    expect(resolveSpinnerDurationMs("250ms")).toBe(250);
  });

  it("reads a bare number as milliseconds, because that is the unit without one", () => {
    expect(resolveSpinnerDurationMs("750")).toBe(750);
  });

  it("reads a duration the way CSS reads it, whatever the case and the spacing", () => {
    expect(resolveSpinnerDurationMs(" 0.5s ")).toBe(500);
    expect(resolveSpinnerDurationMs("0.5S")).toBe(500);
  });

  it("falls back to the documented speed when the value cannot be read", () => {
    for (const speed of ["", "   ", "soon", "s", "0.75s per turn"]) {
      expect(resolveSpinnerDurationMs(speed)).toBe(
        Number.parseFloat(SPINNER_FALLBACK_SPEED) * 1000,
      );
    }
  });

  it("never answers with a duration that would stand still, because a spinner that does not spin is worse than a typo", () => {
    for (const speed of ["0", "0s", "0ms", "-1s", "nonsense"]) {
      expect(resolveSpinnerDurationMs(speed)).toBeGreaterThan(0);
    }
  });

  it("states a fallback both renderers can read: a CSS duration, not a number", () => {
    expect(SPINNER_FALLBACK_SPEED.endsWith("s")).toBe(true);
    expect(Number.parseFloat(SPINNER_FALLBACK_SPEED)).toBeGreaterThan(0);
  });
});
