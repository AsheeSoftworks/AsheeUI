/**
 * Section component styles for AsheeUI.
 * This file provides the static class mappings for the Section layout
 * component: background treatments and shared base classes.
 */

import type { SectionBackground } from "./section-config";

/** Background treatment classes for each section background. */
export const SECTION_BACKGROUND_CLASS: Record<SectionBackground, string> = {
  none: "",
  muted: "bg-secondary/50",
  tinted: "bg-primary/5",
};

/** Shared base classes for every section. */
export const SECTION_BASE_CLASS = "w-full";

/** Separator drawn above a section that asks for one. */
export const SECTION_DIVIDER_CLASS = "border-t border-border";
