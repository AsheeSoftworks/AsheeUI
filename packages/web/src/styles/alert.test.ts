/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import {
  ALERT_TYPE_COLOR,
  ALERT_TYPE_ROLE,
  type AlertType,
  type Color,
  type ColorRole,
} from "@asheeui/core";
import { describe, expect, it } from "vitest";
import { ALERT_TYPE_ICON_CLASS } from "./alert";

/** The intents an alert can take. */
const INTENTS: AlertType[] = ["info", "success", "warning", "error"];

/** The colour roles both platforms name. */
const COLOURS: ColorRole[] = [
  "none",
  "primary",
  "secondary",
  "danger",
  "warning",
  "success",
];

describe("the meaning both renderers share", () => {
  it("gives every intent a colour role", () => {
    expect(Object.keys(ALERT_TYPE_COLOR).sort()).toEqual([...INTENTS].sort());
    for (const colour of Object.values(ALERT_TYPE_COLOR)) {
      expect(COLOURS).toContain(colour as ColorRole);
    }
  });

  it("interrupts only for the two intents that need attention now", () => {
    expect(ALERT_TYPE_ROLE.error).toBe("alert");
    expect(ALERT_TYPE_ROLE.warning).toBe("alert");
    expect(ALERT_TYPE_ROLE.info).toBe("status");
    expect(ALERT_TYPE_ROLE.success).toBe("status");
  });

  it("colours the leading affordance for every intent", () => {
    expect(Object.keys(ALERT_TYPE_ICON_CLASS).sort()).toEqual(
      [...INTENTS].sort(),
    );
  });
});

describe("the alert's colour type", () => {
  it("names the framework's colour vocabulary rather than a palette of its own", () => {
    for (const colour of Object.values(ALERT_TYPE_COLOR)) {
      expect([
        "none",
        "primary",
        "secondary",
        "danger",
        "warning",
        "success",
      ] satisfies Color[]).toContain(colour);
    }
  });
});
