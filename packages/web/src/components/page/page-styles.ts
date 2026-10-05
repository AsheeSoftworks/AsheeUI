/**
 * Page component styles for AsheeUI.
 * This file provides the static class mappings for the four page parts: the
 * shell, the header, the content area and the footer.
 */

/** The page shell: a full-height column that owns the theme background. */
export const PAGE_CLASS = "flex min-h-dvh w-full flex-col bg-background";

/** Shared base classes for the page header. */
export const PAGE_HEADER_CLASS = "w-full bg-background/95 backdrop-blur";

/** Header classes applied while the header sticks to the top of the viewport. */
export const PAGE_HEADER_STICKY_CLASS = "sticky top-0 z-10";

/** Inner padding of the header, applied inside its container. */
export const PAGE_HEADER_INNER_CLASS = "flex w-full items-center gap-4 py-3";

/** Shared base classes for the content area: it fills the space between the
 * header and the footer. */
export const PAGE_CONTENT_CLASS = "flex w-full flex-1 flex-col";

/** Shared base classes for the page footer. */
export const PAGE_FOOTER_CLASS = "w-full bg-secondary/30";

/** Inner padding of the footer, applied inside its container. */
export const PAGE_FOOTER_INNER_CLASS = "flex w-full flex-col gap-2 py-6";

/** Separator drawn between the header and the content area. */
export const PAGE_DIVIDER_CLASS = "border-b border-border";

/** Separator drawn between the content area and the footer. */
export const PAGE_FOOTER_DIVIDER_CLASS = "border-t border-border";
