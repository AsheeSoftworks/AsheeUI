/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import type { CtaPanel } from "@asheeui/core";
import {
  NATIVE_CTA_CENTERED_CLASS,
  NATIVE_CTA_INNER_CLASS,
  NATIVE_CTA_PANEL_CLASS,
} from "./cta";

/** The three panel treatments. */
const PANELS: CtaPanel[] = ["bordered", "muted", "plain"];

describe("the cta's panel", () => {
  it("describes every treatment on both platforms", () => {
    expect(Object.keys(NATIVE_CTA_PANEL_CLASS).sort()).toEqual(
      [...PANELS].sort(),
    );
  });

  it("leaves the plain treatment without a surface on both platforms", () => {
    // The platform's plain treatment still fills the column, so a panel that asked for no
    // surface keeps the same width as the two that draw one.
    expect(NATIVE_CTA_PANEL_CLASS.plain).toBe("w-full");
  });

  it("draws the bordered panel as a bordered surface on both platforms", () => {
    expect(NATIVE_CTA_PANEL_CLASS.bordered).toContain("border border-border");
    expect(NATIVE_CTA_PANEL_CLASS.bordered).toContain("bg-background");
  });

  it("steps its padding up at a breakpoint on the web and states the smaller step on the platform", () => {
    expect(NATIVE_CTA_PANEL_CLASS.bordered).not.toContain("md:");
    expect(NATIVE_CTA_PANEL_CLASS.bordered).toContain("p-6");
  });
});

describe("the cta's inner arrangement", () => {
  it("keeps the statement and its actions in one column on both platforms", () => {
    expect(NATIVE_CTA_INNER_CLASS).toContain("flex-col");
  });

  it("centres the block when the band is centred, on both platforms", () => {
    // The web states the text alignment in the class; the platform passes the alignment to
    // each Text instead, so its block carries the cross-axis alignment alone.
    expect(NATIVE_CTA_CENTERED_CLASS).toBe("items-center");
  });
});
