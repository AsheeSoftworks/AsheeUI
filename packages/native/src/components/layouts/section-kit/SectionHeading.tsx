/**
 * Section heading helper for the native package.
 *
 * This file provides the internal `SectionHeading` component. It is the one
 * implementation of the eyebrow, title and description block the framework's
 * patterns share, so a hero, a feature grid and a call to action present their
 * heading the same way. It is an internal helper: it is not exported from the
 * package entry point and is not part of the public component inventory.
 *
 * What differs from the web helper is only what the platform does with alignment:
 * the web states it once on the block, and the platform states it on each `Text`,
 * because a native text carries its own alignment. The size, the role it resolves
 * to and the alignment vocabulary are the shared ones from `@asheeui/core`, so a
 * `lg` heading means the same step on both platforms.
 */

import {
  SECTION_BLOCK_HEADING_ROLE,
  type SectionBlockAlign,
  type SectionBlockHeadingSize,
} from "@asheeui/core";
import type { ReactNode } from "react";
import { View } from "react-native";
import {
  NATIVE_SECTION_BLOCK_HEADING_ALIGN_CLASS,
  NATIVE_SECTION_BLOCK_HEADING_CLASS,
  SECTION_BLOCK_TEXT_ALIGN,
} from "../../../styles/section-block";
import { cn } from "../../../utils/cn";
import { useUnsupportedProps } from "../../../utils/unsupported-prop";
import { Typography } from "../../typography/text/Text";

/**
 * Heading sizes a section heading can use.
 * The size selects a semantic typography role, so the visual step and the markup
 * step are decided together. The sizes are shared with every band, and this alias
 * is kept so callers keep naming the helper's own option.
 */
export type SectionHeadingSize = SectionBlockHeadingSize;

/**
 * Horizontal alignment of a section heading, shared with every band in the same
 * way as {@link SectionHeadingSize}.
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
   * Size of the title.
   *
   * @default "md"
   */
  size?: SectionHeadingSize;

  /**
   * Additional classes for the wrapper.
   */
  className?: string;

  /**
   * The id the web gives the heading so another element can reference it.
   *
   * A device has no ids to reference; the heading's meaning is carried by the role.
   * Accepted so a shared section compiles; warns once and changes nothing.
   */
  titleId?: string;

  /** The id of the element a skip control targets, for the same reason as {@link titleId}. */
  targetId?: string;
}

/**
 * The eyebrow, title and description block the patterns share.
 *
 * @param props - The heading content and its presentation options.
 * @returns The rendered heading block, or null when it has nothing to show.
 *
 * @see Hero - Uses it for the page's leading statement.
 * @see FeatureGrid - Uses it for the heading above the cards.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  size = "md",
  titleId,
  targetId,
  className,
}: SectionHeadingProps) {
  useUnsupportedProps("SectionHeading", {
    titleId: {
      value: titleId,
      substitute: "ids address DOM elements; nothing references them on a device",
    },
    targetId: {
      value: targetId,
      substitute:
        "a skip control has no element to target; place the reader with setAccessibilityFocus",
    },
  });

  if (!eyebrow && !title && !description) {
    return null;
  }

  const textAlign = SECTION_BLOCK_TEXT_ALIGN[align];

  return (
    <View
      className={cn(
        NATIVE_SECTION_BLOCK_HEADING_CLASS,
        NATIVE_SECTION_BLOCK_HEADING_ALIGN_CLASS[align],
        className,
      )}>
      {eyebrow && (
        <Typography role="overline" tone="primary" align={textAlign}>
          {eyebrow}
        </Typography>
      )}
      {title && (
        <Typography role={SECTION_BLOCK_HEADING_ROLE[size]} align={textAlign}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography role="body-lg" tone="muted" align={textAlign}>
          {description}
        </Typography>
      )}
    </View>
  );
}
