/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
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
