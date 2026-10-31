/**
 * The web renderer's class dictionaries for accordion.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/data-display/accordion/accordion-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { AccordionVariant } from "@asheeui/core";

/** The container's treatment, per variant, on the web. */
export const ACCORDION_VARIANT_CONTAINER_CLASS: Record<
  AccordionVariant,
  string
> = {
  bordered: "border border-border divide-y divide-border",
  separated: "space-y-3",
  ghost: "divide-y divide-border border-y border-border",
  flush: "space-y-1",
};

/** An item's treatment, per variant, on the web. */
export const ACCORDION_VARIANT_ITEM_CLASS: Record<AccordionVariant, string> = {
  bordered: "bg-secondary transition-colors hover:bg-foreground/10",
  separated:
    "border border-border bg-secondary transition-colors hover:bg-secondary/30 shadow-xs",
  ghost: "bg-transparent transition-colors hover:bg-secondary/20",
  flush: "bg-transparent hover:bg-secondary/50 transition-colors",
};
