/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import type { ModalPosition, ModalSizeKey } from "@asheeui/core";
import {
  NATIVE_MODAL_BACKDROP_CLASS,
  NATIVE_MODAL_PANEL_CLASS,
  NATIVE_MODAL_POSITION_CLASS,
  NATIVE_MODAL_WIDTH_CLASS,
} from "./modal";

/** The widths a modal can be. */
const SIZES: ModalSizeKey[] = ["sm", "md", "lg", "xl", "full"];

/** The positions a modal can take. */
const POSITIONS: ModalPosition[] = ["center", "top", "bottom"];

describe("the modal's width", () => {
  it("describes every width on both renderers", () => {
    expect(Object.keys(NATIVE_MODAL_WIDTH_CLASS).sort()).toEqual(
      [...SIZES].sort(),
    );
  });

  it("measures the full width against the viewport on the web and against the screen on the platform", () => {
    expect(NATIVE_MODAL_WIDTH_CLASS.full).toBe("max-w-full");
  });
});

describe("the modal's position", () => {
  it("describes every position on both renderers", () => {
    expect(Object.keys(NATIVE_MODAL_POSITION_CLASS).sort()).toEqual(
      [...POSITIONS].sort(),
    );
  });

  it("pushes the surface to the same edge on both platforms", () => {
    expect(NATIVE_MODAL_POSITION_CLASS.top).toContain("justify-start");
    expect(NATIVE_MODAL_POSITION_CLASS.bottom).toContain("justify-end");
  });

  it("leaves a centred modal to the space it is given", () => {
    expect(NATIVE_MODAL_POSITION_CLASS.center).toBe("justify-center");
  });
});

describe("the modal's surface and the layer behind it", () => {
  it("dims the screen behind the surface, so it is clear what is being dealt with", () => {
    expect(NATIVE_MODAL_BACKDROP_CLASS).toContain("bg-foreground/30");
  });

  it("draws the surface on the theme's background", () => {
    expect(NATIVE_MODAL_PANEL_CLASS).toContain("bg-background");
  });
});
