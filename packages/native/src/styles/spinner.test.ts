/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import type { ColorRole, Size } from "@asheeui/core";
import {
  NATIVE_SPINNER_BASE_CLASS,
  NATIVE_SPINNER_HEAD_CLASS,
  NATIVE_SPINNER_SIZE_CLASS,
  NATIVE_SPINNER_TRACK_CLASS,
} from "./spinner";

/** The densities a spinner can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

/** The colour roles both platforms name. */
const COLOURS: ColorRole[] = [
  "none",
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
];

describe("the native spinner's class maps", () => {
  it("describe every density and every colour role", () => {
    expect(Object.keys(NATIVE_SPINNER_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
    expect(Object.keys(NATIVE_SPINNER_TRACK_CLASS).sort()).toEqual(
      [...COLOURS].sort(),
    );
    expect(Object.keys(NATIVE_SPINNER_HEAD_CLASS).sort()).toEqual(
      [...COLOURS].sort(),
    );
  });

  it("light exactly one side of the ring, because a ring that is one colour all the way round reads as still", () => {
    for (const value of Object.values(NATIVE_SPINNER_HEAD_CLASS)) {
      expect(value.startsWith("border-t-")).toBe(true);
    }
    for (const value of Object.values(NATIVE_SPINNER_TRACK_CLASS)) {
      expect(value).not.toContain("border-t-");
    }
  });

  it("carry the colour role into both the track and the lit side, so the two cannot disagree", () => {
    for (const role of COLOURS) {
      const track = NATIVE_SPINNER_TRACK_CLASS[role].replace("border-", "");
      const head = NATIVE_SPINNER_HEAD_CLASS[role].replace("border-t-", "");
      expect(track.replace("/25", "")).toBe(head);
    }
  });

  it("hold whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [
      NATIVE_SPINNER_SIZE_CLASS,
      NATIVE_SPINNER_TRACK_CLASS,
      NATIVE_SPINNER_HEAD_CLASS,
    ]) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }

    expect(NATIVE_SPINNER_BASE_CLASS).toContain("rounded-full");
    expect(NATIVE_SPINNER_BASE_CLASS).toContain("border-2");
  });
});
