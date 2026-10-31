/**
 * The web renderer's class dictionaries for skeleton.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/feedback/skeleton/skeleton-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

/**
 * Base classes for the web placeholder surface.
 *
 * The surface colour resolves through the theme's secondary token, so a
 * placeholder follows the active theme rather than a grey of its own. It is taken
 * out of pointer and selection handling: it stands in for something, and there is
 * nothing underneath it to press or select.
 */
export const SKELETON_BASE_CLASS =
  "block h-4 w-full bg-secondary/60 select-none pointer-events-none";

/**
 * The web shimmer.
 *
 * It is applied through the `motion-safe` variant rather than from a script, so a
 * consumer who asked for reduced motion sees a still placeholder, and the media
 * query decides that before hydration rather than after a render.
 */
export const SKELETON_ANIMATION_CLASS = "motion-safe:animate-pulse";
