import { describe, expect, it } from "vitest";
import type { ModalPosition, ModalSizeKey } from "./modal-config";
import {
  MODAL_MAX_WIDTH_CLASS,
  MODAL_POSITION_CLASS,
  NATIVE_MODAL_BACKDROP_CLASS,
  NATIVE_MODAL_PANEL_CLASS,
  NATIVE_MODAL_POSITION_CLASS,
  NATIVE_MODAL_WIDTH_CLASS,
} from "./modal-styles";

/** The widths a modal can be. */
const SIZES: ModalSizeKey[] = ["sm", "md", "lg", "xl", "full"];

/** The positions a modal can take. */
const POSITIONS: ModalPosition[] = ["center", "top", "bottom"];

describe("the modal's width", () => {
  it("describes every width on both renderers", () => {
    expect(Object.keys(MODAL_MAX_WIDTH_CLASS).sort()).toEqual(
      [...SIZES].sort(),
    );
    expect(Object.keys(NATIVE_MODAL_WIDTH_CLASS).sort()).toEqual(
      [...SIZES].sort(),
    );
  });

  it("measures the full width against the viewport on the web and against the screen on the platform", () => {
    // The web reads the viewport and takes a gutter off it; the platform is already drawn on
    // the screen it has.
    expect(MODAL_MAX_WIDTH_CLASS.full).toContain("100vw");
    expect(NATIVE_MODAL_WIDTH_CLASS.full).toBe("max-w-full");
  });

  it("grows with the scale on both platforms", () => {
    for (const size of SIZES) {
      expect(MODAL_MAX_WIDTH_CLASS[size]).toMatch(/^max-w-/);
      expect(NATIVE_MODAL_WIDTH_CLASS[size]).toMatch(/^max-w-/);
    }
  });
});

describe("the modal's position", () => {
  it("describes every position on both renderers", () => {
    expect(Object.keys(MODAL_POSITION_CLASS).sort()).toEqual(
      [...POSITIONS].sort(),
    );
    expect(Object.keys(NATIVE_MODAL_POSITION_CLASS).sort()).toEqual(
      [...POSITIONS].sort(),
    );
  });

  it("pushes the surface to the same edge on both platforms", () => {
    expect(MODAL_POSITION_CLASS.top).toContain("self-start");
    expect(NATIVE_MODAL_POSITION_CLASS.top).toContain("justify-start");
    expect(MODAL_POSITION_CLASS.bottom).toContain("self-end");
    expect(NATIVE_MODAL_POSITION_CLASS.bottom).toContain("justify-end");
  });

  it("leaves a centred modal to the space it is given", () => {
    expect(MODAL_POSITION_CLASS.center).toBe("");
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
