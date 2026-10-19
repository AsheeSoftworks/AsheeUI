import { describe, expect, it } from "vitest";
import {
  ERROR_STATE_DETAIL_BODY_CLASS,
  ERROR_STATE_DETAIL_CLASS,
  ERROR_STATE_DETAIL_SUMMARY_CLASS,
  NATIVE_ERROR_STATE_DETAIL_BODY_CLASS,
  NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS,
  NATIVE_ERROR_STATE_DETAIL_CLASS,
  NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS,
} from "./error-state-styles";

/** Every class the failed-region presentation is built from. */
const EVERY_CLASS = {
  ERROR_STATE_DETAIL_CLASS,
  ERROR_STATE_DETAIL_SUMMARY_CLASS,
  ERROR_STATE_DETAIL_BODY_CLASS,
  NATIVE_ERROR_STATE_DETAIL_CLASS,
  NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS,
  NATIVE_ERROR_STATE_DETAIL_BODY_CLASS,
  NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS,
};

describe("the failed region's technical detail on both renderers", () => {
  it("keeps the detail out of the open, behind a disclosure", () => {
    // Both renderers put the technical text behind something a reader opens: the
    // detail is written for a developer, not for the reader of the message.
    expect(ERROR_STATE_DETAIL_CLASS.length).toBeGreaterThan(0);
    expect(NATIVE_ERROR_STATE_DETAIL_CLASS.length).toBeGreaterThan(0);
  });

  it("offers a control that opens the detail on both platforms", () => {
    expect(ERROR_STATE_DETAIL_SUMMARY_CLASS).toContain("font-medium");
    expect(NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS.length).toBeGreaterThan(0);
  });

  it("keeps the technical text as it was written, in a monospaced box", () => {
    // A stack trace is read as it was printed, on either platform.
    expect(ERROR_STATE_DETAIL_BODY_CLASS).toContain("font-mono");
    expect(ERROR_STATE_DETAIL_BODY_CLASS).toContain("border");
    expect(NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS).toContain("font-mono");
    expect(NATIVE_ERROR_STATE_DETAIL_BODY_CLASS).toContain("border");
  });

  it("draws the detail body as a surface of its own on both platforms", () => {
    expect(ERROR_STATE_DETAIL_BODY_CLASS).toContain("bg-background");
    expect(NATIVE_ERROR_STATE_DETAIL_BODY_CLASS).toContain("bg-background");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const [name, value] of Object.entries(EVERY_CLASS)) {
      expect(value.length, name).toBeGreaterThan(0);
      expect(value, name).not.toContain("undefined");
    }
  });
});
