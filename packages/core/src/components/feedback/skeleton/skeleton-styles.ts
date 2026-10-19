/**
 * The Skeleton's class dictionaries, for both renderers.
 *
 * A placeholder is a surface, and the surface is the same token on both platforms,
 * so the two renderers name it the same way and a consumer who retunes the theme
 * retunes both. What differs is the motion: the web shimmers through a class the
 * browser runs before hydration, and native breathes through the platform's own
 * animator, because NativeWind cannot run a keyframe animation on the platform.
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

/**
 * Base classes for the native placeholder surface.
 *
 * The colour is the same token the web uses, so a placeholder is the same weight
 * of grey on both platforms. There is no animation class: the pulse is an
 * `Animated` value the component drives, which is the platform's own mechanism and
 * the only one that runs there.
 */
export const NATIVE_SKELETON_BASE_CLASS = "bg-secondary/60 overflow-hidden";
