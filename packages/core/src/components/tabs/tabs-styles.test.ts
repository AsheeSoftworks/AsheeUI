import { describe, expect, it } from "vitest";
import type { Size } from "../../shared/radius";
import type { TabsVariant } from "./tabs-config";
import {
  NATIVE_TABS_LIST_CLASS,
  NATIVE_TABS_TRIGGER_CLASS,
  NATIVE_TABS_VARIANT_CONTENT_CLASS,
  NATIVE_TABS_VARIANT_LIST_CLASS,
  TABS_FONT_CLASS,
  TABS_HEIGHT_CLASS,
  TABS_PADDING_X_CLASS,
} from "./tabs-styles";

/** The densities a tab bar can be. */
const DENSITIES: Size[] = ["sm", "md", "lg"];

/** The visual styles a tab bar can take. */
const VARIANTS: TabsVariant[] = ["underline", "bordered", "ghost"];

describe("the tabs' scale", () => {
  it("describes the height, the padding and the type size at every density", () => {
    for (const map of [
      TABS_HEIGHT_CLASS,
      TABS_PADDING_X_CLASS,
      TABS_FONT_CLASS,
    ]) {
      expect(Object.keys(map).sort()).toEqual([...DENSITIES].sort());
    }
  });

  it("grows a trigger with its density on the web", () => {
    expect(TABS_HEIGHT_CLASS.sm).toBe("h-8");
    expect(TABS_HEIGHT_CLASS.md).toBe("h-10");
    expect(TABS_HEIGHT_CLASS.lg).toBe("h-12");
  });

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
