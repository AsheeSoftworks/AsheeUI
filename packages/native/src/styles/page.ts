/**
 * The platform's class dictionaries for page.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/layouts/page/page-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/**
 * The native page shell.
 *
 * The web states a minimum height in viewport units, because a document page grows with what
 * it holds and has to be told not to be shorter than the window. A native screen is given its
 * height by the platform and the shell is what fills it, so the shell grows instead.
 */
export const NATIVE_PAGE_CLASS = "flex flex-1 w-full flex-col bg-background";

/**
 * Shared classes for the native page header.
 *
 * The web bar is translucent and blurs whatever scrolls behind it. The platform has no
 * backdrop filter, so the bar paints the theme's own background solidly rather than claiming
 * a translucency it cannot show.
 */
export const NATIVE_PAGE_HEADER_CLASS = "w-full bg-background";

/**
 * The sticky treatment of the native header.
 *
 * The platform has no scroll-linked positioning, so there is nothing for this class to say;
 * it is empty rather than absent so that `sticky` remains a shared option a screen ignores
 * rather than one it has to strip. A screen that must keep its header in view places the
 * header outside its scrolling region, which is the platform's own way of pinning a bar.
 */
export const NATIVE_PAGE_HEADER_STICKY_CLASS = "";

/**
 * The inner row of the native header.
 *
 * The web states no direction, because a block element lays its children out along the row
 * already; the platform states the direction it means rather than relying on a default.
 */
export const NATIVE_PAGE_HEADER_INNER_CLASS =
  "flex w-full flex-row items-center gap-4 py-3";

/** Shared classes for the native content area, which fills the space between the bars. */
export const NATIVE_PAGE_CONTENT_CLASS = "flex w-full flex-1 flex-col";

/** Shared classes for the native page footer. */
export const NATIVE_PAGE_FOOTER_CLASS = "w-full bg-secondary/30";

/** The inner column of the native footer. */
export const NATIVE_PAGE_FOOTER_INNER_CLASS = "flex w-full flex-col gap-2 py-6";

/** The rule the native header draws against the content. */
export const NATIVE_PAGE_DIVIDER_CLASS = "border-b border-border";

/** The rule the native footer draws against the content. */
export const NATIVE_PAGE_FOOTER_DIVIDER_CLASS = "border-t border-border";
