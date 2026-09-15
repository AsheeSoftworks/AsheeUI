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

import type { ElementType, ReactNode } from "react";
import { cn } from "../../utils";
import { Typography } from "../typography/Typography";

/**
 * Heading sizes a section heading can use.
 * The size selects a semantic typography role, so the visual step and the
 * markup step are decided together.
 */
export type SectionHeadingSize = "md" | "lg" | "xl";

/**
 * Horizontal alignment of a section heading.
 */
export type SectionHeadingAlign = "start" | "center";

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
        "flex flex-col gap-2",
        centered && "items-center text-center",
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
          role={
            size === "xl"
              ? "display"
              : size === "lg"
                ? "heading-xl"
                : "heading-lg"
          }
          className={centered ? "text-balance" : "text-pretty"}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography
          role="body-lg"
          tone="muted"
          className={cn("max-w-2xl", centered && "mx-auto")}>
          {description}
        </Typography>
      )}
    </div>
  );
}
