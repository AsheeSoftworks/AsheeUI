/**
 * The platform's class dictionaries for cta.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/marketing/cta/cta-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { CtaPanel } from "@asheeui/core";

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
