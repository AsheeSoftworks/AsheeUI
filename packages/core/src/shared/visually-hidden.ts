/**
 * Text that is read rather than seen, shared by both platforms.
 *
 * A few components say something to assistive technology that they do not show: that a
 * dismissed state was applied, that a copied value is on the clipboard, that a feature is
 * not part of a plan. The meaning must not depend on the visual treatment alone, and it
 * must not take up room on the screen either, so it is stated in words that are in the
 * accessibility tree and out of the layout.
 *
 * Both platforms say that with one class, and they say it the only way their own renderer
 * can: the web's `sr-only` keeps the text in the document while taking it out of the
 * layout, and the platform has no such utility, so the text is a pixel-sized, fully
 * transparent view — out of the way, and still announced.
 */

/**
 * Text that is announced but not shown, on the web.
 */
export const VISUALLY_HIDDEN_CLASS = "sr-only";

/**
 * Text that is announced but not shown, on the platform.
 */
export const NATIVE_VISUALLY_HIDDEN_CLASS = "absolute w-px h-px opacity-0";
