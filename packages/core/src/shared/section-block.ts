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
 * The visual step and the markup step are decided together, so a band cannot grow a
 * heading that reads as a display line while its outline still calls it a section title.
 */
export type SectionBlockHeadingSize = "md" | "lg" | "xl";

/**
 * The typography role each heading size resolves to.
 *
 * The sizes are the band's own vocabulary; the roles are the shared typography scale's, and
 * the map is what connects one to the other. It lives here so a hero and a call to action
 * cannot disagree about what a `lg` heading looks like.
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
  align?: SectionBlockAlign;

  /** Vertical padding of the band, from the shared spacing scale. */
  spacing?: Space;

  /** Background treatment of the band. */
  background?: SectionBackground;

  /** Maximum content width. */
  containerSize?: ContainerSize;

  /**
   * Whether the band wraps its content in a container, so the framework's maximum width
   * and gutter apply. A consumer turns this off to nest the band in its own layout.
   */
  contained?: boolean;
}

// ─── The heading block ────────────────────────────────────────────────────────

/**
 * The heading block, on the web: an eyebrow, a title and a supporting sentence.
 * The alignment is added from the map below rather than stated here, because it is the one
 * part of the block that changes with the band's own choice.
 */
export const SECTION_BLOCK_HEADING_CLASS = "flex flex-col gap-2";

/** Alignment of the heading block, on the web. */
export const SECTION_BLOCK_HEADING_ALIGN_CLASS: Record<
  SectionBlockAlign,
  string
> = {
  start: "",
  center: "items-center text-center",
};

/**
 * Measure of the supporting sentence, on the web.
 * A sentence reads badly past a certain width, so the block states one.
 */
export const SECTION_BLOCK_DESCRIPTION_CLASS = "max-w-2xl";

/** The measure a centred supporting sentence keeps, on the web. */
export const SECTION_BLOCK_DESCRIPTION_CENTERED_CLASS = "mx-auto";

/** The heading block, on the platform. */
export const NATIVE_SECTION_BLOCK_HEADING_CLASS = "w-full flex-col gap-1";

/** Alignment of the heading block, on the platform. */
export const NATIVE_SECTION_BLOCK_HEADING_ALIGN_CLASS: Record<
  SectionBlockAlign,
  string
> = {
  start: "items-start",
  center: "items-center",
};

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

/**
 * The row that holds a band's configured actions, on the web.
 * It stacks on a narrow screen and sits in a row from the `sm` breakpoint, which is the
 * arrangement that keeps two actions readable on a phone without a media query.
 */
export const SECTION_BLOCK_ACTIONS_CLASS =
  "flex flex-col gap-3 sm:flex-row sm:items-center";

/** Alignment of the action row, on the web. */
export const SECTION_BLOCK_ACTIONS_ALIGN_CLASS: Record<
  SectionBlockAlign,
  string
> = {
  start: "",
  center: "sm:justify-center",
};

/**
 * The row that holds a band's configured actions, on the platform.
 * The platform has one width, so the row is a wrapping row rather than a column that becomes
 * a row at a breakpoint: two actions wrap onto a second line when their labels need the
 * room, which is what a thumb reads best.
 */
export const NATIVE_SECTION_BLOCK_ACTIONS_CLASS =
  "flex-row flex-wrap items-center gap-2";

/** Alignment of the action row, on the platform. */
export const NATIVE_SECTION_BLOCK_ACTIONS_ALIGN_CLASS: Record<
  SectionBlockAlign,
  string
> = {
  start: "justify-start",
  center: "justify-center",
};
