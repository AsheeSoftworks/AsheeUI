/**
 * Page component styles for AsheeUI.
 *
 * The file provides the static class mappings for the four page parts — the shell, the
 * header, the content area and the footer — for both renderers, kept side by side so a
 * change to the shell's shape lands on both platforms at once. Every entry is a complete,
 * static class string, because both Tailwind and NativeWind compile the classes they can
 * read in the source.
 */

// ─── Web ──────────────────────────────────────────────────────────────────────

/** The page shell: a full-height column that owns the theme background. */
export const PAGE_CLASS = "flex min-h-dvh w-full flex-col bg-background";

/** Shared base classes for the page header. */
export const PAGE_HEADER_CLASS = "w-full bg-background/95 backdrop-blur";

/** Header classes applied while the header sticks to the top of the viewport. */
export const PAGE_HEADER_STICKY_CLASS = "sticky top-0 z-10";

/** Inner padding of the header, applied inside its container. */
export const PAGE_HEADER_INNER_CLASS = "flex w-full items-center gap-4 py-3";

/**
 * Shared base classes for the content area: it fills the space between the header and the
 * footer.
 */
export const PAGE_CONTENT_CLASS = "flex w-full flex-1 flex-col";

/** Shared base classes for the page footer. */
export const PAGE_FOOTER_CLASS = "w-full bg-secondary/30";

/** Inner padding of the footer, applied inside its container. */
export const PAGE_FOOTER_INNER_CLASS = "flex w-full flex-col gap-2 py-6";

/** Separator drawn between the header and the content area. */
export const PAGE_DIVIDER_CLASS = "border-b border-border";

/** Separator drawn between the content area and the footer. */
export const PAGE_FOOTER_DIVIDER_CLASS = "border-t border-border";

// ─── Native ───────────────────────────────────────────────────────────────────

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
