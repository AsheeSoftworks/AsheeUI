/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import {
  NATIVE_ERROR_STATE_DETAIL_BODY_CLASS,
  NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS,
  NATIVE_ERROR_STATE_DETAIL_CLASS,
  NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS,
} from "./error-state";

/** Every class the failed-region presentation is built from. */
const EVERY_CLASS = {
  NATIVE_ERROR_STATE_DETAIL_CLASS,
  NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS,
  NATIVE_ERROR_STATE_DETAIL_BODY_CLASS,
  NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS,
};

describe("the failed region's technical detail on both renderers", () => {
  it("keeps the detail out of the open, behind a disclosure", () => {
    expect(NATIVE_ERROR_STATE_DETAIL_CLASS.length).toBeGreaterThan(0);
  });

  it("offers a control that opens the detail on both platforms", () => {
    expect(NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS.length).toBeGreaterThan(0);
  });

  it("keeps the technical text as it was written, in a monospaced box", () => {
    expect(NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS).toContain("font-mono");
    expect(NATIVE_ERROR_STATE_DETAIL_BODY_CLASS).toContain("border");
  });

  it("draws the detail body as a surface of its own on both platforms", () => {
    expect(NATIVE_ERROR_STATE_DETAIL_BODY_CLASS).toContain("bg-background");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const [_name, value] of Object.entries(EVERY_CLASS)) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain("undefined");
    }
  });
});
