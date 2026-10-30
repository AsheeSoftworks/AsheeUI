/**
 * The platform's class dictionaries, tested where they live.
 *
 * The web half of this file moved to `@asheeui/web` in C2, with the strings it states: after the
 * shrink no package can import both renderers, so neither suite compares them any more.
 */

import type { TabsVariant } from "@asheeui/core";
import {
  NATIVE_TABS_LIST_CLASS,
  NATIVE_TABS_TRIGGER_CLASS,
  NATIVE_TABS_VARIANT_CONTENT_CLASS,
  NATIVE_TABS_VARIANT_LIST_CLASS,
} from "./tabs";

/** The visual styles a tab bar can take. */
const VARIANTS: TabsVariant[] = ["underline", "bordered", "ghost"];

describe("the tabs' scale", () => {
  it("never lets a native trigger fall short of the shared touch target", () => {
    // A web trigger is sized for a pointer; a platform trigger is sized for a thumb, and
    // the shared rule states the least a target may be.
    expect(NATIVE_TABS_TRIGGER_CLASS).toContain("min-h-[44px]");
  });
});

describe("the tabs' bar", () => {
  it("describes every variant on the platform", () => {
    expect(Object.keys(NATIVE_TABS_VARIANT_LIST_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
    expect(Object.keys(NATIVE_TABS_VARIANT_CONTENT_CLASS).sort()).toEqual(
      [...VARIANTS].sort(),
    );
  });

  it("draws the selected trigger's rule under the bar when the bar is underlined", () => {
    expect(NATIVE_TABS_VARIANT_LIST_CLASS.underline).toContain("border-b");
    expect(NATIVE_TABS_VARIANT_LIST_CLASS.bordered).toContain("border");
    expect(NATIVE_TABS_VARIANT_LIST_CLASS.ghost).toBe("");
  });

  it("keeps the triggers in one row that can scroll, which is what the platform's bar is", () => {
    expect(NATIVE_TABS_LIST_CLASS).toContain("flex-row");
    expect(NATIVE_TABS_LIST_CLASS).toContain("w-full");
  });
});
