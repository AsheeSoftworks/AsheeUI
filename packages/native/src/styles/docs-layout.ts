/**
 * The platform's class dictionaries for docs-layout.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/layouts/docs-layout/docs-layout-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/**
 * The native composition.
 *
 * The web states a minimum height in viewport units, because a document page grows with what it
 * holds and has to be told not to be shorter than the window. A native screen is given its height
 * by the platform, and three stacked regions do not fit a phone's screen at once, so the
 * composition is the scrolling region itself — the same decision the marketing composition makes,
 * for the same reason.
 */
export const NATIVE_DOCS_LAYOUT_CLASS = "flex-1 w-full bg-background";

/**
 * The scrolling content: the regions, in order.
 * The platform states the direction it means rather than relying on a default.
 */
export const NATIVE_DOCS_LAYOUT_CONTENT_CLASS = "flex w-full flex-col";

/**
 * A stacked region — the navigation and the contents.
 *
 * The web places these beside the article in their own columns and hides the contents below the
 * `xl` breakpoint, where there is no room for a third column. A platform screen has no columns at
 * all, so both regions are kept, one above the article and one below it, and the web's landmark
 * names become the titles that head them: a screen reader that cannot be told "this is a
 * navigation landmark" can be shown what the region is.
 */
export const NATIVE_DOCS_LAYOUT_REGION_CLASS =
  "flex w-full flex-col gap-3 py-6";

/**
 * The navigation and the contents as the platform shows them.
 * The region states the title, and what the consumer supplied follows it, so both are statements
 * of the same section rather than two sections that happen to sit together.
 */
export const NATIVE_DOCS_LAYOUT_NAVIGATION_CLASS = "flex w-full flex-col pt-3";

/**
 * The article region.
 * It is the section the identifier of the page's main region is stated on.
 */
export const NATIVE_DOCS_LAYOUT_ARTICLE_CLASS = "flex w-full flex-col py-6";

/**
 * The reading measure of the native article body.
 *
 * The web caps the body at a readable line length while the columns around it stay wider; the
 * platform reaches the same measure through the framework's own container, so the cap is the
 * container's rather than a second statement of one, and what is left here is the rhythm between
 * the article's own blocks.
 */
export const NATIVE_DOCS_LAYOUT_BODY_CLASS = "flex w-full flex-col gap-6";

/**
 * The width of the reading measure, as a container size.
 * The web states it on the body itself; the platform states it as the size of the container the
 * body is wrapped in, because a native text block does not cap its own width.
 */
export const NATIVE_DOCS_LAYOUT_BODY_SIZE = "md" as const;
