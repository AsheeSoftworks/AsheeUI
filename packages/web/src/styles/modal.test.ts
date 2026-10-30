/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import type { ModalPosition, ModalSizeKey } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import { MODAL_MAX_WIDTH_CLASS, MODAL_POSITION_CLASS } from "./modal";

/** The widths a modal can be. */
const SIZES: ModalSizeKey[] = ["sm", "md", "lg", "xl", "full"];

/** The positions a modal can take. */
const POSITIONS: ModalPosition[] = ["center", "top", "bottom"];

describe("the modal's width", () => {
  it("describes every width on both renderers", () => {
    expect(Object.keys(MODAL_MAX_WIDTH_CLASS).sort()).toEqual(
      [...SIZES].sort(),
    );
  });

  it("measures the full width against the viewport on the web and against the screen on the platform", () => {
    // The web reads the viewport and takes a gutter off it; the platform is already drawn on
    // the screen it has.
    expect(MODAL_MAX_WIDTH_CLASS.full).toContain("100vw");
  });
});

describe("the modal's position", () => {
  it("describes every position on both renderers", () => {
    expect(Object.keys(MODAL_POSITION_CLASS).sort()).toEqual(
      [...POSITIONS].sort(),
    );
  });

  it("pushes the surface to the same edge on both platforms", () => {
    expect(MODAL_POSITION_CLASS.top).toContain("self-start");
    expect(MODAL_POSITION_CLASS.bottom).toContain("self-end");
  });

  it("leaves a centred modal to the space it is given", () => {
    expect(MODAL_POSITION_CLASS.center).toBe("");
  });
});
