/**
 * CTA component styles for AsheeUI.
 * This file provides the static class mappings for the CTA pattern: the panel
 * treatments and the inner arrangement of the panel.
 */

import type { CtaPanel } from "./cta-config";

/** Panel treatment classes. */
export const CTA_PANEL_CLASS: Record<CtaPanel, string> = {
  bordered: "rounded-md border border-border bg-background p-8 md:p-12",
  muted: "rounded-md bg-secondary/50 p-8 md:p-12",
  plain: "",
};

/** Inner arrangement of the panel. */
export const CTA_INNER_CLASS = "flex flex-col gap-6";

/** Centred variant of the inner arrangement. */
export const CTA_CENTERED_CLASS = "items-center text-center";
