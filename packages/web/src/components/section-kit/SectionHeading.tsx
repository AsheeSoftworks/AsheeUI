/**
 * Section heading helper for AsheeUI.
 *
 * This file provides the internal `SectionHeading` component. It is the one
 * implementation of the eyebrow, title and description block that the
 * framework's patterns share, so a hero, a feature grid, a testimonial wall and
 * a pricing card present their heading the same way. It is an internal helper:
 * it is not exported from the package entry point and is not part of the public
 * component inventory.
 */

import {
  cn,
  SECTION_BLOCK_DESCRIPTION_CENTERED_CLASS,
  SECTION_BLOCK_DESCRIPTION_CLASS,
  SECTION_BLOCK_HEADING_ALIGN_CLASS,
  SECTION_BLOCK_HEADING_CLASS,
  SECTION_BLOCK_HEADING_ROLE,
  type SectionBlockAlign,
  type SectionBlockHeadingSize,
} from "@asheeui/core";
import type { ElementType, ReactNode } from "react";
import { Typography } from "../typography/Typography";

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
 * Props for the internal SectionHeading helper.
 */
export interface SectionHeadingProps {
  /**
   * Short label above the title, for example the category of a section.
   */
  eyebrow?: ReactNode;

  /**
   * The heading itself.
   */
  title?: ReactNode;

  /**
   * Supporting sentence under the title.
   */
  description?: ReactNode;

  /**
   * Horizontal alignment of the block.
   *
   * @default "start"
   */
  align?: SectionHeadingAlign;

  /**
   * Element the title renders as.
   * Defaults to the element the resolved typography role implies.
   */
  titleAs?: ElementType;

  /**
   * Size of the title.
   *
   * @default "md"
   */
  size?: SectionHeadingSize;

  /**
   * Identifier applied to the title element, so a section can point at it with
   * `aria-labelledby`.
   */
  titleId?: string;

  /**
   * Additional classes for the wrapper.
   */
  className?: string;
}

/**
 * The eyebrow, title and description block the patterns share.
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
          as={titleAs}
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
