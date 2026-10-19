import { describe, expect, it } from "vitest";
import type { CtaPanel } from "./cta-config";
import {
  CTA_CENTERED_CLASS,
  CTA_INNER_CLASS,
  CTA_PANEL_CLASS,
  NATIVE_CTA_CENTERED_CLASS,
  NATIVE_CTA_INNER_CLASS,
  NATIVE_CTA_PANEL_CLASS,
} from "./cta-styles";

/** The three panel treatments. */
const PANELS: CtaPanel[] = ["bordered", "muted", "plain"];

describe("the cta's panel", () => {
  it("describes every treatment on both platforms", () => {
    expect(Object.keys(CTA_PANEL_CLASS).sort()).toEqual([...PANELS].sort());
    expect(Object.keys(NATIVE_CTA_PANEL_CLASS).sort()).toEqual(
      [...PANELS].sort(),
    );
  });

  it("leaves the plain treatment without a surface on both platforms", () => {
    expect(CTA_PANEL_CLASS.plain).toBe("");
    // The platform's plain treatment still fills the column, so a panel that asked for no
    // surface keeps the same width as the two that draw one.
    expect(NATIVE_CTA_PANEL_CLASS.plain).toBe("w-full");
  });

  it("draws the bordered panel as a bordered surface on both platforms", () => {
    expect(CTA_PANEL_CLASS.bordered).toContain("border border-border");
    expect(CTA_PANEL_CLASS.bordered).toContain("bg-background");
    expect(NATIVE_CTA_PANEL_CLASS.bordered).toContain("border border-border");
    expect(NATIVE_CTA_PANEL_CLASS.bordered).toContain("bg-background");
  });

  it("steps its padding up at a breakpoint on the web and states the smaller step on the platform", () => {
    expect(CTA_PANEL_CLASS.bordered).toContain("md:p-12");
    expect(NATIVE_CTA_PANEL_CLASS.bordered).not.toContain("md:");
    expect(NATIVE_CTA_PANEL_CLASS.bordered).toContain("p-6");
  });
});

describe("the cta's inner arrangement", () => {
  it("keeps the statement and its actions in one column on both platforms", () => {
    expect(CTA_INNER_CLASS).toContain("flex-col");
    expect(NATIVE_CTA_INNER_CLASS).toContain("flex-col");
  });

  it("centres the block when the band is centred, on both platforms", () => {
    expect(CTA_CENTERED_CLASS).toContain("items-center");
    // The web states the text alignment in the class; the platform passes the alignment to
    // each Text instead, so its block carries the cross-axis alignment alone.
    expect(NATIVE_CTA_CENTERED_CLASS).toBe("items-center");
  });
});
