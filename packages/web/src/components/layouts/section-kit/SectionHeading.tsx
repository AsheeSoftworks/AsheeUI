/**
 * Section heading helper for AsheeUI.
 *
 * This file provides the public `SectionHeading` component. It is the one
 * implementation of the eyebrow, title and description block that the
 * framework's patterns share, so a hero, a feature grid, a testimonial wall and
 * a pricing card present their heading the same way. It is public through the
 * `@asheeui/web/section-kit` subpath rather than the package entry point, and
 * is documented on the section page (https://www.asheeui.com/components/layouts/section)
 * under "The section kit".
 */

import {
  cn,
  SECTION_BLOCK_HEADING_ELEMENT,
  SECTION_BLOCK_HEADING_ROLE,
  type SectionBlockAlign,
  type SectionBlockHeadingSize,
} from "@asheeui/core";
import type { ElementType, ReactNode } from "react";
import {
  SECTION_BLOCK_DESCRIPTION_CENTERED_CLASS,
  SECTION_BLOCK_DESCRIPTION_CLASS,
  SECTION_BLOCK_HEADING_ALIGN_CLASS,
  SECTION_BLOCK_HEADING_CLASS,
} from "../../../styles/section-block";
import { Typography } from "../../typography/Typography";

/**
 * Heading sizes a section heading can use.
 * The size selects a semantic typography role, so the visual step and the
 * markup step are decided together. The sizes and the role they resolve to are
 * shared vocabulary — `@asheeui/core` declares them, so a heading in a marketing
 * band and a heading the native renderer draws name one set — and this alias is
 * kept so callers keep naming the helper's own option.
 */
export type SectionHeadingSize = SectionBlockHeadingSize;

/**
 * Horizontal alignment of a section heading, shared with every band in the
 * same way as {@link SectionHeadingSize}.
 */
export type SectionHeadingAlign = SectionBlockAlign;

/**
 * Props for the public SectionHeading helper.
 */
export interface SectionHeadingProps {
  /**
   * Short label above the title, for example the category of a section.
   */
  eyebrow?: ReactNode | undefined;

  /**
   * The heading itself.
   */
  title?: ReactNode | undefined;

  /**
   * Supporting sentence under the title.
   */
  description?: ReactNode | undefined;

  /**
   * Horizontal alignment of the block.
   *
   * @default "start"
   */
  align?: SectionHeadingAlign | undefined;

  /**
   * Element the title renders as.
   *
   * Defaults to `h2` at **every** size, because a heading block belongs to a
   * band — a section of a page — rather than to the page itself: two bands on
   * one page must not produce two `h1`s. Pass `h1` when the block really is the
   * page's own title, and `h3` or lower when it sits under an existing section
   * heading.
   *
   * @default "h2"
   */
  titleAs?: ElementType | undefined;

  /**
   * Size of the title.
   *
   * The size selects the typography role, so it decides the visual step only;
   * the element is `titleAs`.
   *
   * @default "md"
   */
  size?: SectionHeadingSize | undefined;

  /**
   * Identifier applied to the title element, so a section can point at it with
   * `aria-labelledby`.
   */
  titleId?: string | undefined;

  /**
   * Additional classes for the wrapper.
   */
  className?: string | undefined;
}

/**
 * The eyebrow, title and description block the patterns share.
 *
 * The title's element is `h2` unless `titleAs` says otherwise — at every size,
 * so a page of bands keeps one `h1` — and its visual step comes from `size`.
 *
 * @param props - The heading content and its presentation options.
 * @returns The rendered heading block, or null when it has nothing to show.
 *
 * @see Hero - Uses it for the page's leading statement.
 * @see FeatureGrid - Uses it for the heading above the grid.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  titleAs,
  size = "md",
  titleId,
  className,
}: SectionHeadingProps) {
  if (!eyebrow && !title && !description) {
    return null;
  }

  const centered = align === "center";
  const TitleElement: ElementType =
    titleAs ?? SECTION_BLOCK_HEADING_ELEMENT[size];

  return (
    <div
      className={cn(
        SECTION_BLOCK_HEADING_CLASS,
        SECTION_BLOCK_HEADING_ALIGN_CLASS[align],
        className,
      )}>
      {eyebrow && (
        <Typography role="overline" tone="primary">
          {eyebrow}
        </Typography>
      )}
      {title && (
        <Typography
          as={TitleElement}
          id={titleId}
          role={SECTION_BLOCK_HEADING_ROLE[size]}
          className={centered ? "text-balance" : "text-pretty"}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography
          role="body-lg"
          tone="muted"
          className={cn(
            SECTION_BLOCK_DESCRIPTION_CLASS,
            centered && SECTION_BLOCK_DESCRIPTION_CENTERED_CLASS,
          )}>
          {description}
        </Typography>
      )}
    </div>
  );
}
