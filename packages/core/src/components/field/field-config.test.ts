import { describe, expect, it } from "vitest";
import type { Color } from "../../shared/variant";
import {
  FALLBACK_FIELD_CONFIG,
  type FieldConfig,
  type FieldStatus,
  isFieldInvalid,
  resolveFieldStatusColor,
} from "./field-config";

/** Every status the framework names. */
const STATUSES: FieldStatus[] = ["default", "error", "warning", "success"];

/** The statuses that describe a value the user has to correct. */
const FAILURES: FieldStatus[] = ["error"];

/** The colour roles a field can be accented with. */
const COLOURS: Color[] = [
  "none",
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
];

describe("isFieldInvalid", () => {
  it("answers for every status the framework names", () => {
    for (const status of STATUSES) {
      expect(typeof isFieldInvalid(status)).toBe("boolean");
    }
  });

  it("names the failed state and nothing else", () => {
    for (const status of STATUSES) {
      expect(isFieldInvalid(status)).toBe(FAILURES.includes(status));
    }
  });
});

describe("resolveFieldStatusColor", () => {
  it("gives every status that reports something its own semantic role", () => {
    expect(resolveFieldStatusColor("error", "secondary")).toBe("danger");
    expect(resolveFieldStatusColor("warning", "secondary")).toBe("warning");
    expect(resolveFieldStatusColor("success", "secondary")).toBe("success");
  });

  it("leaves a field with nothing to report on the accent the consumer chose", () => {
    for (const colour of COLOURS) {
      expect(resolveFieldStatusColor("default", colour)).toBe(colour);
    }
  });

  it("outranks the configured accent, whichever one it is", () => {
    for (const colour of COLOURS) {
      expect(resolveFieldStatusColor("error", colour)).toBe("danger");
    }
  });
});

describe("FALLBACK_FIELD_CONFIG", () => {
  it("answers for every option the field's contract offers", () => {
    const options: (keyof FieldConfig)[] = [
      "size",
      "radius",
      "variant",
      "color",
      "labelAlign",
      "fullWidth",
      "status",
    ];

    for (const option of options) {
      expect(FALLBACK_FIELD_CONFIG[option]).toBeDefined();
    }
  });

  it("agrees with the values the field family documents", () => {
    expect(FALLBACK_FIELD_CONFIG.size).toBe("md");
    expect(FALLBACK_FIELD_CONFIG.radius).toBe("md");
    expect(FALLBACK_FIELD_CONFIG.variant).toBe("bordered");
    expect(FALLBACK_FIELD_CONFIG.color).toBe("primary");
    expect(FALLBACK_FIELD_CONFIG.labelAlign).toBe("left");
    expect(FALLBACK_FIELD_CONFIG.fullWidth).toBe(false);
    expect(FALLBACK_FIELD_CONFIG.status).toBe("default");
  });
});
