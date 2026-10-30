/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import type { ImageFit, ImageRatioKey } from "@asheeui/core";
import {
  NATIVE_IMAGE_ASPECT_RATIO,
  NATIVE_IMAGE_FRAME_CLASS,
  NATIVE_IMAGE_PICTURE_CLASS,
  NATIVE_IMAGE_PICTURE_FILL_CLASS,
  NATIVE_IMAGE_RESIZE_MODE,
  NATIVE_IMAGE_SKELETON_CLASS,
} from "./image";

/** The five fit strategies. */
const FITS: ImageFit[] = ["cover", "contain", "fill", "none", "scale-down"];

/** The four ratio keys. */
const RATIOS: ImageRatioKey[] = ["auto", "square", "video", "portrait"];

describe("the image's fit", () => {
  it("describes every strategy on both platforms", () => {
    expect(Object.keys(NATIVE_IMAGE_RESIZE_MODE).sort()).toEqual(
      [...FITS].sort(),
    );
  });

  it("covers and contains on both platforms", () => {
    expect(NATIVE_IMAGE_RESIZE_MODE.cover).toBe("cover");
    expect(NATIVE_IMAGE_RESIZE_MODE.contain).toBe("contain");
  });

  it("states the two strategies the platform names differently in its own vocabulary", () => {
    expect(NATIVE_IMAGE_RESIZE_MODE.fill).toBe("stretch");
    expect(NATIVE_IMAGE_RESIZE_MODE.none).toBe("center");
  });

  it("resolves scale-down to contain on the platform", () => {
    // The platform has no scale-down: a container that never enlarges a small picture is
    // what the web's scale-down asks for, so the strategy resolves rather than vanishes.
    expect(NATIVE_IMAGE_RESIZE_MODE["scale-down"]).toBe("contain");
  });
});

describe("the image's ratio", () => {
  it("describes every ratio on both platforms", () => {
    expect(Object.keys(NATIVE_IMAGE_ASPECT_RATIO).sort()).toEqual(
      [...RATIOS].sort(),
    );
  });

  it("uses intrinsic dimensions when the ratio is auto, on both platforms", () => {
    expect(NATIVE_IMAGE_ASPECT_RATIO.auto).toBeUndefined();
  });

  it("states the same two shapes on both platforms", () => {
    expect(NATIVE_IMAGE_ASPECT_RATIO.square).toBe(1);
    expect(NATIVE_IMAGE_ASPECT_RATIO.video).toBe(16 / 9);
  });

  it("keeps the portrait ratio the web draws, as a number the platform lays out", () => {
    expect(NATIVE_IMAGE_ASPECT_RATIO.portrait).toBe(3 / 4);
  });
});

describe("the native frame", () => {
  it("fills its column and clips the picture to the resolved radius", () => {
    expect(NATIVE_IMAGE_FRAME_CLASS).toContain("w-full");
    expect(NATIVE_IMAGE_FRAME_CLASS).toContain("overflow-hidden");
  });

  it("fills the frame when the frame decides the shape, and claims the width when it does not", () => {
    expect(NATIVE_IMAGE_PICTURE_FILL_CLASS).toBe("h-full w-full");
    // Without a stated ratio the height comes from the source, so the picture states its
    // width alone.
    expect(NATIVE_IMAGE_PICTURE_CLASS).toBe("w-full");
  });

  it("covers the frame with the placeholder until the picture arrives", () => {
    expect(NATIVE_IMAGE_SKELETON_CLASS).toBe("absolute inset-0");
  });
});
