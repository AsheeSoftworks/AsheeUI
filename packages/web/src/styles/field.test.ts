/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import type { FieldStatus, LabelAlign } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import {
  FIELD_DESCRIPTION_CLASS,
  FIELD_LABEL_ALIGN_CLASS,
  FIELD_LABEL_CLASS,
  FIELD_LABEL_CONTENT_CLASS,
  FIELD_MESSAGE_CLASS,
  FIELD_SHELL_CLASS,
  FIELD_STATUS_BORDER_CLASS,
} from "./field";
import { FIELD_STATUS_TEXT_CLASS } from "./portable";

/** Every status the framework names. */
const STATUSES: FieldStatus[] = ["default", "error", "warning", "success"];

/** Every alignment a label can take. */
const ALIGNMENTS: LabelAlign[] = ["left", "center", "right"];

describe("the field family's class maps", () => {
  const classes = [
    FIELD_SHELL_CLASS,
    FIELD_LABEL_CLASS,
    FIELD_LABEL_CONTENT_CLASS,
    FIELD_DESCRIPTION_CLASS,
    FIELD_MESSAGE_CLASS,
  ];

  it("describe every status, so a message or an edge is never missing", () => {
    for (const map of [FIELD_STATUS_TEXT_CLASS, FIELD_STATUS_BORDER_CLASS]) {
      expect(Object.keys(map).sort()).toEqual([...STATUSES].sort());
    }
  });

  it("describe every label alignment", () => {
    expect(Object.keys(FIELD_LABEL_ALIGN_CLASS).sort()).toEqual(
      [...ALIGNMENTS].sort(),
    );
  });

  it("hold whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const value of classes) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain("undefined");
    }
  });

  it("leaves a status that has nothing to say without an edge rather than with a stray one", () => {
    expect(FIELD_STATUS_BORDER_CLASS.default).toBe("");
  });

  it("names the danger edge once, so a failed field and a failed control agree", () => {
    expect(FIELD_STATUS_BORDER_CLASS.error).toContain("border-danger");
  });
});
