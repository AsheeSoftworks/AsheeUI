import { describe, expect, it } from "vitest";
import type { FieldStatus, LabelAlign } from "./field-config";
import {
  FIELD_DESCRIPTION_CLASS,
  FIELD_LABEL_ALIGN_CLASS,
  FIELD_LABEL_CLASS,
  FIELD_LABEL_CONTENT_CLASS,
  FIELD_MESSAGE_CLASS,
  FIELD_REQUIRED_MARKER_CLASS,
  FIELD_SHELL_CLASS,
  FIELD_STATUS_BORDER_CLASS,
  FIELD_STATUS_TEXT_CLASS,
  NATIVE_FIELD_LABEL_ROW_CLASS,
  NATIVE_FIELD_SHELL_CLASS,
} from "./field-styles";

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
