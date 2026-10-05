import { describe, expect, it } from "vitest";
import {
  NATIVE_ANNOUNCEMENT_LIVE_REGION,
  resolveNativeAnnouncementRole,
} from "../../shared/announcement";
import { NATIVE_MESSAGE_SURFACE_CLASS } from "../../shared/message-surface";
import type { Color, Variant } from "../../shared/variant";
import type { ColorRole } from "../../tokens";
import type { AlertType } from "./alert-config";
import {
  ALERT_TYPE_COLOR,
  ALERT_TYPE_ICON_CLASS,
  ALERT_TYPE_ROLE,
  NATIVE_ALERT_DISMISS_CLASS,
  NATIVE_ALERT_GLYPH_CLASS,
  NATIVE_ALERT_TYPE_GLYPH,
} from "./alert-styles";

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

/** The treatments an alert can wear, which is the union the config names. */
const VARIANTS: Exclude<Variant, "underlined">[] = [
  "solid",
  "faded",
  "bordered",
  "ghost",
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

describe("the native alert's class maps", () => {
  it("holds a glyph for every intent, so no intent renders an empty slot", () => {
    expect(Object.keys(NATIVE_ALERT_TYPE_GLYPH).sort()).toEqual(
      [...INTENTS].sort(),
    );

    for (const glyph of Object.values(NATIVE_ALERT_TYPE_GLYPH)) {
      expect(glyph.length).toBeGreaterThan(0);
    }
  });

  it("honours the treatments a message surface can wear, in the shared map both the alert and the toast read", () => {
    for (const variant of VARIANTS) {
      expect(Object.keys(NATIVE_MESSAGE_SURFACE_CLASS[variant]).sort()).toEqual(
        [...COLOURS].sort(),
      );
    }
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    expect(NATIVE_ALERT_GLYPH_CLASS.length).toBeGreaterThan(0);
    expect(NATIVE_ALERT_DISMISS_CLASS).toContain("rounded");
  });

  it("announces each intent with the urgency the shared role map states", () => {
    for (const intent of INTENTS) {
      const role = ALERT_TYPE_ROLE[intent];
      // The urgency is stated twice — once as the web's role, once as the region
      // the platform names — and the shared rule is what keeps the two agreeing.
      expect(NATIVE_ANNOUNCEMENT_LIVE_REGION[role]).toBe(
        role === "alert" ? "assertive" : "polite",
      );
      expect(resolveNativeAnnouncementRole(role)).toBe(
        role === "alert" ? "alert" : undefined,
      );
    }
  });
});

describe("the treatments an alert can wear", () => {
  it("is the same set a message surface wears, because an alert is one", () => {
    for (const variant of VARIANTS) {
      expect(NATIVE_MESSAGE_SURFACE_CLASS[variant]).toBeDefined();
    }
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
