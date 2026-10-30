/**
 * Tests for the marquee's still-frame class maps.
 *
 * The stillness is the one part of the marquee that has nothing to move, so its classes
 * are the whole of the statement: with the loop stopped the platform renders the content
 * once, in a frame that scrolls, and the copy wraps on the horizontal axis so what would
 * have scrolled past is read in place. The two maps live here beside every other marquee
 * class map so a style change to the resting marquee is made once, for both renderers.
 *
 * The dictionaries these tests state are split across two packages for one release: the
 * platform's half moved to `@asheeui/native`, and the file moved with it because it states both
 * renderers side by side and native is the package that can still see core. C2 moves the web's
 * half to `@asheeui/web`, and these assertions follow it.
 */

import {
  NATIVE_MARQUEE_STILL_FRAME_CLASS,
  NATIVE_MARQUEE_STILL_SET_CLASS,
} from "./marquee";

describe("the native marquee's still frame", () => {
  it("claims the full extent of the axis the marquee reads along", () => {
    expect(NATIVE_MARQUEE_STILL_FRAME_CLASS).toEqual({
      x: "w-full",
      y: "flex-1",
    });
  });

  it("leaves the scrolling to the platform's scroll view", () => {
    // The platform's `ScrollView` owns the scrolling itself, so the frame states no
    // overflow; a class here would be a second, web-shaped opinion about the same thing.
    expect(NATIVE_MARQUEE_STILL_FRAME_CLASS.x).not.toContain("overflow");
    expect(NATIVE_MARQUEE_STILL_FRAME_CLASS.y).not.toContain("overflow");
  });
});

describe("the native marquee's still copy", () => {
  it("wraps the horizontal copy and stacks the vertical one", () => {
    expect(NATIVE_MARQUEE_STILL_SET_CLASS.x).toBe("flex-row flex-wrap");
    expect(NATIVE_MARQUEE_STILL_SET_CLASS.y).toBe("flex-col");
  });

  it("describes each axis exactly once, as every class map in the family does", () => {
    for (const axis of ["x", "y"] as const) {
      expect(NATIVE_MARQUEE_STILL_SET_CLASS[axis]).toBeTruthy();
    }
  });
});
