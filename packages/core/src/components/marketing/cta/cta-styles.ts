/**
 * The CTA's class dictionaries, for both renderers.
 *
 * The panel is a surface, so it rounds the same and carries the same accent on both
 * platforms. What differs is the room it claims: the web steps its padding up at a
 * breakpoint, because a wide window can afford a taller band, and the platform has one
 * window and states the smaller step. The three treatments themselves are one decision
 * stated twice rather than two lists that drift, which is why the maps sit side by side.
 *
 * Every entry is a complete, static class string. An unprefixed `CTA_*` constant is the web
 * renderer's; `NATIVE_CTA_*` is the native renderer's.
 */

import type { CtaPanel } from "./cta-config";

/** Panel treatment classes, on the web. */
export const CTA_PANEL_CLASS: Record<CtaPanel, string> = {
  bordered: "rounded-md border border-border bg-background p-8 md:p-12",
  muted: "rounded-md bg-secondary/50 p-8 md:p-12",
  plain: "",
};

/** Inner arrangement of the panel, on the web. */
export const CTA_INNER_CLASS = "flex flex-col gap-6";

/** Centred variant of the inner arrangement, on the web. */
export const CTA_CENTERED_CLASS = "items-center text-center";

// ─── Native ───────────────────────────────────────────────────────────────────

/**
 * Panel treatment classes, on the platform.
 *
 * The platform states the density the web states at its smallest step, because it has one
 * window: a panel that padded itself for a desktop would crowd the band it sits in on a
 * phone. The panel fills the column it is given, so a bordered panel's edge lines up with
 * the container's gutter rather than shrinking to its content.
 */
export const NATIVE_CTA_PANEL_CLASS: Record<CtaPanel, string> = {
  bordered: "w-full rounded-md border border-border bg-background p-6",
  muted: "w-full rounded-md bg-secondary/40 p-6",
  plain: "w-full",
};

/** Inner arrangement of the panel, on the platform. */
export const NATIVE_CTA_INNER_CLASS = "w-full flex-col gap-4";

/** Centred variant of the inner arrangement, on the platform. */
export const NATIVE_CTA_CENTERED_CLASS = "items-center";
