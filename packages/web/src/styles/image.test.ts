/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { IMAGE_FIT_CLASS, IMAGE_RATIO_CLASS } from "./image";
import { type ImageFit, type ImageRatioKey } from "@asheeui/core";

/** The five fit strategies. */
const FITS: ImageFit[] = ["cover", "contain", "fill", "none", "scale-down"];

/** The four ratio keys. */
const RATIOS: ImageRatioKey[] = ["auto", "square", "video", "portrait"];

describe("the image's fit", () => {
  it("describes every strategy on both platforms", () => {
    expect(Object.keys(IMAGE_FIT_CLASS).sort()).toEqual([...FITS].sort());
  });

  it("covers and contains on both platforms", () => {
    expect(IMAGE_FIT_CLASS.cover).toBe("object-cover");
    expect(IMAGE_FIT_CLASS.contain).toBe("object-contain");
  });

  it("states the two strategies the platform names differently in its own vocabulary", () => {
    // `fill` stretches on the web and on the platform alike; the platform calls it
        // `stretch` because that is what its image view calls it.
        expect(IMAGE_FIT_CLASS.fill).toBe("object-fill");
    // `none` means the natural size, which is the platform's centered placement.
        expect(IMAGE_FIT_CLASS.none).toBe("object-none");
  });

});

describe("the image's ratio", () => {
  it("describes every ratio on both platforms", () => {
    expect(Object.keys(IMAGE_RATIO_CLASS).sort()).toEqual([...RATIOS].sort());
  });

  it("uses intrinsic dimensions when the ratio is auto, on both platforms", () => {
    // The web states this by adding no class; the platform by stating no number.
        expect(IMAGE_RATIO_CLASS.auto).toBe("");
  });

  it("states the same two shapes on both platforms", () => {
    expect(IMAGE_RATIO_CLASS.square).toBe("aspect-square");
    expect(IMAGE_RATIO_CLASS.video).toBe("aspect-video");
  });

  it("keeps the portrait ratio the web draws, as a number the platform lays out", () => {
    // The web states 3/4 as an arbitrary aspect class, so the two platforms must agree
        // on the ratio itself rather than on the syntax that expresses it.
        expect(IMAGE_RATIO_CLASS.portrait).toBe("aspect-[3/4]");
  });

});
