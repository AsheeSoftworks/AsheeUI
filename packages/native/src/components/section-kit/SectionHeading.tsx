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
  NATIVE_SECTION_BLOCK_HEADING_ALIGN_CLASS,
  NATIVE_SECTION_BLOCK_HEADING_CLASS,
  SECTION_BLOCK_HEADING_ROLE,
  SECTION_BLOCK_TEXT_ALIGN,
  type SectionBlockAlign,
  type SectionBlockHeadingSize,
} from "@asheeui/core";
import type { ReactNode } from "react";
import { View } from "react-native";
import { classNames } from "../../utils/class-names";
import { Text } from "../text/Text";

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
  className,
}: SectionHeadingProps) {
  if (!eyebrow && !title && !description) {
    return null;
  }

  const textAlign = SECTION_BLOCK_TEXT_ALIGN[align];

  return (
    <View
      className={classNames(
        NATIVE_SECTION_BLOCK_HEADING_CLASS,
        NATIVE_SECTION_BLOCK_HEADING_ALIGN_CLASS[align],
        className,
      )}>
      {eyebrow && (
        <Text role="overline" tone="primary" align={textAlign}>
          {eyebrow}
        </Text>
      )}
      {title && (
        <Text role={SECTION_BLOCK_HEADING_ROLE[size]} align={textAlign}>
          {title}
        </Text>
      )}
      {description && (
        <Text role="body-lg" tone="muted" align={textAlign}>
          {description}
        </Text>
      )}
    </View>
  );
}
