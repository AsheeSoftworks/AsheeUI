/**
 * The class dictionaries' tests, moved with them.
 *
 * These files state both renderers' maps side by side, which is how the two are kept in step.
 * The platform's half now lives in `@asheeui/native` (C1), and this is the only package that can
 * still read core's half, so the file came with it. C2 moves the web's half to `@asheeui/web`
 * and these assertions follow it there.
 */

import {
  NATIVE_SPINNER_BASE_CLASS,
  NATIVE_SPINNER_HEAD_CLASS,
  NATIVE_SPINNER_SIZE_CLASS,
  NATIVE_SPINNER_TRACK_CLASS,
} from "./spinner";
import {
  type Size,
  type ColorRole,
  SPINNER_BASE_CLASS,
  SPINNER_COLOR_CLASS,
  SPINNER_SIZE_CLASS,
} from "@asheeui/core";
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

describe("the web spinner's class maps", () => {
  it("describe every density a spinner can be", () => {
    expect(Object.keys(SPINNER_SIZE_CLASS).sort()).toEqual(
      [...DENSITIES].sort(),
    );
  });

  it("describe every colour role", () => {
    expect(Object.keys(SPINNER_COLOR_CLASS).sort()).toEqual(
      [...COLOURS].sort(),
    );
  });

  it("colour the ring through the current colour, so a role is a text colour here", () => {
    for (const value of Object.values(SPINNER_COLOR_CLASS)) {
      expect(value.startsWith("text-")).toBe(true);
    }
  });

  it("draws `none` as the ink of a filled surface, not as an inherited colour", () => {
    // `none` is what a spinner over a solid surface wants: the same colour the
    // surface paints its content in. Nothing in the map inherits; a spinner that
    // should take the surrounding text colour is given `text-current` explicitly.
    expect(SPINNER_COLOR_CLASS.none).toBe("text-background");
    expect(SPINNER_COLOR_CLASS.none).not.toBe("text-current");
  });

  it("rotates inside `motion-safe`, as the skeleton's shimmer does", () => {
    // A reader who asked for reduced motion gets a still ring; the status region's
    // label, not the movement, carries the wait.
    expect(SPINNER_BASE_CLASS.split(" ")).toContain("motion-safe:animate-spin");
    expect(SPINNER_BASE_CLASS).not.toMatch(/(?:^|\s)animate-spin(?:\s|$)/);
  });
});

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
