/**
 * The web renderer's class dictionaries, tested where they live.
 *
 * These assertions were half of a file that stated both renderers' maps side by side, which was
 * how the two were kept in step while `@asheeui/core` held both sets. C2 moved the web strings
 * to `@asheeui/web` and the platform's to `@asheeui/native` (C1), so each renderer's suite now
 * states its own; the keys both must cover are asserted on each side.
 */

import { describe, expect, it } from "vitest";


import { CTA_CENTERED_CLASS, CTA_INNER_CLASS, CTA_PANEL_CLASS } from "./cta";
import { type CtaPanel } from "@asheeui/core";

/** The three panel treatments. */
const PANELS: CtaPanel[] = ["bordered", "muted", "plain"];

describe("the cta's panel", () => {
  it("describes every treatment on both platforms", () => {
    expect(Object.keys(CTA_PANEL_CLASS).sort()).toEqual([...PANELS].sort());
  });

  it("leaves the plain treatment without a surface on both platforms", () => {
    expect(CTA_PANEL_CLASS.plain).toBe("");
  });

  it("draws the bordered panel as a bordered surface on both platforms", () => {
    expect(CTA_PANEL_CLASS.bordered).toContain("border border-border");
    expect(CTA_PANEL_CLASS.bordered).toContain("bg-background");
  });

  it("steps its padding up at a breakpoint on the web and states the smaller step on the platform", () => {
    expect(CTA_PANEL_CLASS.bordered).toContain("md:p-12");
  });

});

describe("the cta's inner arrangement", () => {
  it("keeps the statement and its actions in one column on both platforms", () => {
    expect(CTA_INNER_CLASS).toContain("flex-col");
  });

  it("centres the block when the band is centred, on both platforms", () => {
    expect(CTA_CENTERED_CLASS).toContain("items-center");
  });

});
