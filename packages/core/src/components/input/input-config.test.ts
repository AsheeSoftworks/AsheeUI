import { describe, expect, it } from "vitest";
import { FALLBACK_FIELD_CONFIG, type FieldConfig } from "../field/field-config";
import type { InputConfig } from "./input-config";

describe("the Input's contract", () => {
  it("accepts every option the field family offers, because an input is a field", () => {
    const asField: FieldConfig = {
      size: "lg",
      radius: "full",
      variant: "underlined",
      color: "secondary",
      labelAlign: "right",
      fullWidth: true,
      status: "error",
    };

    // The assignment is the assertion: an option the family offers but the input
    // does not accept is what this refuses to compile.
    const asInput: InputConfig = asField;

    expect(asInput).toEqual(asField);
  });

  it("is answered completely by the family's fallback, so no tier can come up empty", () => {
    const complete: Required<InputConfig> = FALLBACK_FIELD_CONFIG;

    expect(Object.keys(complete).sort()).toEqual(
      Object.keys(FALLBACK_FIELD_CONFIG).sort(),
    );
  });
});
