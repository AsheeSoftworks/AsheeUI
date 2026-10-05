/**
 * Tests for the field family's shared layer.
 *
 * The family's members are one shape wearing several controls, so what the shared layer owes
 * them is a set of agreements: every member falls back to the same values the family states,
 * every map that is keyed by a status or a density is total over it, and the one rule two
 * platforms implement — what a code keeps — is stated once. These tests assert those
 * agreements rather than any one renderer's output.
 */

import { describe, expect, it } from "vitest";
import { FALLBACK_CALENDAR_CONFIG } from "./calendar/calendar-config";
import { FALLBACK_FIELD_CONFIG, type FieldStatus } from "./field/field-config";
import {
  FIELD_STATUS_BORDER_CLASS,
  FIELD_STATUS_TEXT_CLASS,
} from "./field/field-styles";
import { FALLBACK_FILE_UPLOAD_CONFIG } from "./file-upload/file-upload-config";
import { FALLBACK_FORM_CONFIG } from "./form/form-config";
import {
  FALLBACK_PIN_INPUT_CONFIG,
  type PinInputMode,
} from "./pin-input/pin-input-config";
import { sanitizePinValue } from "./pin-input/pin-input-helpers";
import { FALLBACK_RADIO_CONFIG } from "./radio/radio-config";
import { RADIO_STATUS_BORDER_CLASS } from "./radio/radio-styles";
import { FALLBACK_SEARCH_INPUT_CONFIG } from "./search-input/search-input-config";
import { FALLBACK_STEPPER_CONFIG } from "./stepper/stepper-config";
import { FALLBACK_SWITCH_CONFIG } from "./switch/switch-config";
import { FALLBACK_TEXTAREA_CONFIG } from "./textarea/textarea-config";

const STATUSES: FieldStatus[] = ["default", "error", "warning", "success"];

describe("the field family's contracts", () => {
  it("states every fallback a member inherits from the family", () => {
    for (const config of [
      FALLBACK_SWITCH_CONFIG,
      FALLBACK_TEXTAREA_CONFIG,
      FALLBACK_RADIO_CONFIG,
    ]) {
      expect(config.size).toBe(FALLBACK_FIELD_CONFIG.size);
      expect(config.color).toBe(FALLBACK_FIELD_CONFIG.color);
      expect(config.variant).toBeTypeOf("string");
    }
  });

  it("rounds a member whose shape asks for it differently", () => {
    // A radio is round because of what it is, so its own fallback states the rounding; a
    // switch registers its rounding as a default instead, because its fallback is the
    // family's and a consumer may change what a switch looks like without changing the family.
    expect(FALLBACK_RADIO_CONFIG.radius).toBe("full");
    expect(FALLBACK_SWITCH_CONFIG.radius).toBe(FALLBACK_FIELD_CONFIG.radius);
    expect(FALLBACK_TEXTAREA_CONFIG.radius).toBe(FALLBACK_FIELD_CONFIG.radius);
  });

  it("reserves one fallback per member, so a control is never left without a value", () => {
    expect(FALLBACK_SEARCH_INPUT_CONFIG.size).toBe("md");
    expect(FALLBACK_PIN_INPUT_CONFIG.length).toBe(4);
    expect(FALLBACK_STEPPER_CONFIG.orientation).toBe("responsive");
    expect(FALLBACK_FORM_CONFIG.submitVariant).toBe("solid");
    expect(FALLBACK_FILE_UPLOAD_CONFIG.size).toBe("md");
    expect(FALLBACK_CALENDAR_CONFIG.mode).toBe("date");
  });

  it("describes every status in every status map, so a message or an edge is never missing", () => {
    for (const map of [
      FIELD_STATUS_TEXT_CLASS,
      FIELD_STATUS_BORDER_CLASS,
      RADIO_STATUS_BORDER_CLASS,
    ]) {
      for (const status of STATUSES) {
        expect(map[status]).toBeTypeOf("string");
      }
    }
  });

  it("tones a failed field's edge with the family's own", () => {
    expect(FIELD_STATUS_BORDER_CLASS.error).toContain("border-danger");
    expect(RADIO_STATUS_BORDER_CLASS.error).toContain("border-danger");
    expect(RADIO_STATUS_BORDER_CLASS.default).toBe("border-border");
  });
});

describe("the code field's shared rule", () => {
  it("keeps only the characters a mode accepts", () => {
    expect(sanitizePinValue("12a3", "numeric")).toBe("123");
    expect(sanitizePinValue("12a3-", "alphanumeric")).toBe("12a3");
    expect(sanitizePinValue("ab c", "text")).toBe("abc");
  });

  it("caps the value at the length the field collects", () => {
    expect(sanitizePinValue("12345", "numeric", 4)).toBe("1234");
    expect(sanitizePinValue("1234", "numeric", 6)).toBe("1234");
  });

  it("states one mode vocabulary both platforms read", () => {
    const modes: PinInputMode[] = ["numeric", "alphanumeric", "text"];

    for (const mode of modes) {
      expect(sanitizePinValue("a1", mode)).toBeTypeOf("string");
    }
  });
});
