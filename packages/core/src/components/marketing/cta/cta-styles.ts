/**
 * The CTA's class dictionaries, for the web renderer.
 *
 * The panel is a surface, so it rounds the same and carries the same accent on both
 * platforms. What differs is the room it claims: the web steps its padding up at a
 * breakpoint, because a wide window can afford a taller band, and the platform has one
 * window and states the smaller step. The three treatments themselves are one decision
 * stated twice rather than two lists that drift, which is why the maps sit side by side.
 *
 * Every entry is a complete, static class string. An unprefixed `CTA_*` constant is the web
 * renderer's; `NATIVE_CTA_*` is the native renderer's.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
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
