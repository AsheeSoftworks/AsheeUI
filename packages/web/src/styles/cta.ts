/**
 * The web renderer's class dictionaries for cta.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/marketing/cta/cta-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { CtaPanel } from "@asheeui/core";

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
