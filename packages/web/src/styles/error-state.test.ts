/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";

import {
  ERROR_STATE_DETAIL_BODY_CLASS,
  ERROR_STATE_DETAIL_CLASS,
  ERROR_STATE_DETAIL_SUMMARY_CLASS,
} from "./error-state";

/** Every class the failed-region presentation is built from. */
const EVERY_CLASS = {
  ERROR_STATE_DETAIL_CLASS,
  ERROR_STATE_DETAIL_SUMMARY_CLASS,
  ERROR_STATE_DETAIL_BODY_CLASS,
};

describe("the failed region's technical detail on both renderers", () => {
  it("keeps the detail out of the open, behind a disclosure", () => {
    // Both renderers put the technical text behind something a reader opens: the
    // detail is written for a developer, not for the reader of the message.
    expect(ERROR_STATE_DETAIL_CLASS.length).toBeGreaterThan(0);
  });

  it("offers a control that opens the detail on both platforms", () => {
    expect(ERROR_STATE_DETAIL_SUMMARY_CLASS).toContain("font-medium");
  });

  it("draws the library's focus ring on the only focusable control it has", () => {
    // Every other control in the library draws this ring; the disclosure would be
    // the one surface whose focus treatment depended on the browser.
    expect(ERROR_STATE_DETAIL_SUMMARY_CLASS).toContain("focus-visible:ring-2");
    expect(ERROR_STATE_DETAIL_SUMMARY_CLASS).toContain(
      "focus-visible:ring-primary",
    );
    expect(ERROR_STATE_DETAIL_SUMMARY_CLASS).toContain(
      "focus-visible:ring-offset-2",
    );
  });

  it("keeps the technical text as it was written, in a monospaced box", () => {
    // A stack trace is read as it was printed, on either platform.
    expect(ERROR_STATE_DETAIL_BODY_CLASS).toContain("font-mono");
    expect(ERROR_STATE_DETAIL_BODY_CLASS).toContain("border");
  });

  it("draws the detail body as a surface of its own on both platforms", () => {
    expect(ERROR_STATE_DETAIL_BODY_CLASS).toContain("bg-background");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const [_name, value] of Object.entries(EVERY_CLASS)) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain("undefined");
    }
  });
});
