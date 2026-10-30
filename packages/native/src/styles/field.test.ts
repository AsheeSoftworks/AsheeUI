/**
 * The class dictionaries' tests, moved with them.
 *
 * These files state both renderers' maps side by side, which is how the two are kept in step.
 * The platform's half now lives in `@asheeui/native` (C1), and this is the only package that can
 * still read core's half, so the file came with it. C2 moves the web's half to `@asheeui/web`
 * and these assertions follow it there.
 */

import {
  NATIVE_FIELD_LABEL_ROW_CLASS,
  NATIVE_FIELD_SHELL_CLASS,
} from "./field";
import {
  type FieldStatus,
  type LabelAlign,
  FIELD_DESCRIPTION_CLASS,
  FIELD_LABEL_ALIGN_CLASS,
  FIELD_LABEL_CLASS,
  FIELD_LABEL_CONTENT_CLASS,
  FIELD_MESSAGE_CLASS,
  FIELD_REQUIRED_MARKER_CLASS,
  FIELD_SHELL_CLASS,
  FIELD_STATUS_BORDER_CLASS,
  FIELD_STATUS_TEXT_CLASS,
} from "@asheeui/core";
/** Every status the framework names. */
const STATUSES: FieldStatus[] = ["default", "error", "warning", "success"];

/** Every alignment a label can take. */
const ALIGNMENTS: LabelAlign[] = ["left", "center", "right"];

describe("the field family's class maps", () => {
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
    const classes = [
      FIELD_SHELL_CLASS,
      FIELD_LABEL_CLASS,
      FIELD_LABEL_CONTENT_CLASS,
      FIELD_REQUIRED_MARKER_CLASS,
      FIELD_DESCRIPTION_CLASS,
      FIELD_MESSAGE_CLASS,
      NATIVE_FIELD_SHELL_CLASS,
      NATIVE_FIELD_LABEL_ROW_CLASS,
      ...Object.values(FIELD_LABEL_ALIGN_CLASS),
      ...Object.values(FIELD_STATUS_TEXT_CLASS),
    ];

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
