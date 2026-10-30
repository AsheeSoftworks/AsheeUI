/**
 * The vocabulary a marketing band shares, for both platforms.
 *
 * A band is a full-width strip of a page — a hero, a feature grid, a call to action, a
 * footer — and every band the framework ships asks the same questions about itself: how
 * wide its content may grow, how much vertical room it claims, what it paints behind that
 * content, whether it centres what it holds, and whether it draws its own column or leaves
 * that to the page. Those questions are named here, once, so `components.hero` and
 * `components.cta` mean the same thing in a web application and in a native one.
 *
 * Two of the values are the reason this module exists at all rather than four unrelated
 * ones. `ContainerSize` and `SectionBackground` are read by the layout primitives as well as
 * by the bands, so a `Section` written with `background="muted"` and a hero written with the
 * same option are talking about one idea, and there is one place to change what `muted`
 * means. They are declared here rather than inside either renderer, and both renderers
 * re-export them, so a configuration on either platform names one type.
 *
 * What the module also states is the arrangement a band's heading and its action row take,
 * as class dictionaries for each renderer, kept side by side so they cannot drift. The web
 * composes its bands from a heading helper and an action group; the platform composes the
 * same two shapes from the same strings. What differs is the technology — the web states
 * responsive alignment with a class variant and the platform states one arrangement,
 * because it resolves the window itself rather than a stylesheet doing it.
 *
 * The module registers nothing and imports no renderer.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Space } from "./spacing";

/**
 * Maximum content width of a band's column.
 *
 * - `sm`: a single reading column.
 * - `md`: a narrow application or form column.
 * - `lg`: the default content width.
 * - `xl`: a wide application shell.
 * - `full`: no maximum width.
 */
export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Background treatment of a band.
 *
 * - `none`: transparent, so the page background shows through.
 * - `muted`: a subdued band, used to separate one section from the next.
 * - `tinted`: a faint accent band, used to emphasise a section.
 */
export type SectionBackground = "none" | "muted" | "tinted";

/**
 * Horizontal alignment of a band's content.
 */
export type SectionBlockAlign = "start" | "center";

/**
 * Size of a band's heading, which selects a semantic typography role.
 * The size decides the visual step alone: the element the title renders as is stated by
 * {@link SECTION_BLOCK_HEADING_ELEMENT}, so a band can grow a heading that reads as a display
 * line while its outline still records a section title rather than the page's own.
 */
export type SectionBlockHeadingSize = "md" | "lg" | "xl";

/**
 * The heading elements a band's title may render as.
 * Restricted to the headings, because the title's whole job is its place in the document
 * outline: a title rendered as a `div` would look like a heading and be nothing.
 */
export type SectionBlockHeadingElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

/**
 * The typography role each heading size resolves to.
 *
 * The sizes are the band's own vocabulary; the roles are the shared typography scale's, and
 * the map is what connects one to the other. It lives here so a hero and a call to action
 * cannot disagree about what a `lg` heading looks like.
 *
 * A role is a visual treatment, and the element a role implies is only that role's own default:
 * a band states its element separately, because what a heading is called in the outline is a
 * decision about the page rather than about the design scale.
 */
export const SECTION_BLOCK_HEADING_ROLE: Record<
  SectionBlockHeadingSize,
  "display" | "heading-xl" | "heading-lg"
> = {
  md: "heading-lg",
  lg: "heading-xl",
  xl: "display",
};

/**
 * The element a band's heading renders as when the band names no element.
 *
 * A band is a *section* of a page, not the page's own title, so every size renders an `h2`:
 * a hero, a call to action, a feature grid and a testimonial wall can then sit on one page
 * without producing a heading per band at level one. Raising the level is the caller's
 * decision — `titleAs` on the heading — and it is the only way a band becomes the document's
 * `h1`; lowering it, for a band nested under an existing section, is the same prop.
 *
 * This is deliberately a map rather than a single constant: if a size ever needs a different
 * default the size is the thing that changes, and every renderer reads the change from here.
 */
export const SECTION_BLOCK_HEADING_ELEMENT: Record<
  SectionBlockHeadingSize,
  SectionBlockHeadingElement
> = {
  md: "h2",
  lg: "h2",
  xl: "h2",
};

/**
 * The band options every band shares.
 *
 * A band's configuration extends this and adds what is particular to it — a hero adds where
 * its media sits, a call to action adds its panel treatment, a feature grid adds its columns
 * — so the four resolve one set of options through one cascade rule and differ only where
 * they genuinely differ.
 *
 * The interface states what each option means rather than what it defaults to: a band
 * registers its own default, and that component's own documentation is where the value is
 * read. A hero claims a taller band than a closing call to action does, and neither of those
 * values would be truthful stated here.
 */
export interface SectionBlockOptions {
  /** Alignment of the band's content. */
  align?: SectionBlockAlign | undefined;

  /** Vertical padding of the band, from the shared spacing scale. */
  spacing?: Space | undefined;

  /** Background treatment of the band. */
  background?: SectionBackground | undefined;

  /** Maximum content width. */
  containerSize?: ContainerSize | undefined;

  /**
   * Whether the band wraps its content in a container, so the framework's maximum width
   * and gutter apply. A consumer turns this off to nest the band in its own layout.
   */
  contained?: boolean | undefined;
}

// ─── The heading block ────────────────────────────────────────────────────────

/**
 * How a band's text is aligned, per alignment.
 * The web states this with a `text-center` class on the block; the platform states it on
 * each `Text`, so the band passes the value rather than a class.
 */
export const SECTION_BLOCK_TEXT_ALIGN: Record<
  SectionBlockAlign,
  "left" | "center"
> = {
  start: "left",
  center: "center",
};

// ─── The action row ───────────────────────────────────────────────────────────
