/**
 * Badge component for AsheeUI.
 * This file provides the Badge component, a compact status or label indicator
 * whose colours, variant, size, and radius resolve through the standard
 * AsheeUI cascade system.
 */

"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Color, Radius, Size, Variant } from "../../shared";
import { RADIUS_CLASS, resolveVariantClass } from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  type BadgeConfig,
  type BadgeVariant,
  FALLBACK_BADGE_CONFIG,
} from "./badge-config";
import {
  BADGE_FONT_CLASS,
  BADGE_GAP_CLASS,
  BADGE_HEIGHT_CLASS,
  BADGE_ICON_SIZE_CLASS,
  BADGE_PADDING_CLASS,
} from "./badge-styles";

type BaseBadgeProps = BadgeConfig &
  Omit<HTMLAttributes<HTMLSpanElement>, "color" | "content">;

/**
 * Configuration options for the Badge component.
 */
export interface BadgeProps extends BaseBadgeProps {
  /**
   * Badge content.
   * Typically a short piece of text. Omit it when the badge shows only an icon
   * and pass `label` instead so the badge still has an accessible name.
   */
  children?: ReactNode;

  /**
   * Text that stands in for the badge's content.
   * Use it when the badge shows only an icon: the text is rendered for
   * assistive technology and the visible content is treated as decoration. A
   * badge with visible text does not need it, because its text is its content.
   */
  label?: string;

  /**
   * Content rendered before the badge text, typically an icon.
   */
  startContent?: ReactNode;

  /**
   * Content rendered after the badge text, typically an icon.
   */
  endContent?: ReactNode;
}

/**
 * A compact status or label indicator.
 *
 * Badge renders an inline, non-interactive element for short pieces of status
 * or category information. Its colour, variant, size, and radius resolve
 * through the standard AsheeUI cascade: prop, component config, global theme
 * defaults, and the built-in fallback. It is decorative in the sense that it
 * carries no interaction of its own: pointer events, focus, and keyboard
 * behaviour belong to whatever it is placed inside.
 *
 * Consumer `className` is appended last, so it can restyle or reposition the
 * badge without fighting the framework's classes.
 *
 * @param props - Badge configuration options and span attributes.
 * @param props.children - Badge text or content.
 * @param props.label - Text that stands in for the content of an icon-only badge.
 * @param props.variant - Visual style variant. Defaults to the configured value.
 * @param props.color - Theme accent colour. Defaults to the configured value.
 * @param props.size - Density scale. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "full".
 * @param props.startContent - Content rendered before the badge text.
 * @param props.endContent - Content rendered after the badge text.
 * @param props.className - Extra classes applied last.
 *
 * @example
 * ```tsx
 * <Badge color="success">Active</Badge>
 * ```
 *
 * @example
 * ```tsx
 * // Icon only: the label is the badge's accessible name.
 * <Badge label="Active" startContent={<CheckIcon />} />
 * ```
 *
 * @see BadgeConfig - The configuration type for component defaults.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant,
      color,
      size,
      radius,
      label,
      children,
      startContent,
      endContent,
      className,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.badge as BadgeConfig | undefined;

    const rawVariant = resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant as BadgeVariant | undefined,
      FALLBACK_BADGE_CONFIG.variant,
    );

    // A badge has no underline treatment, so a global "underlined" default
    // resolves to the bordered treatment instead.
    const resolvedVariantKey: BadgeVariant =
      rawVariant === "underlined" ? "bordered" : (rawVariant as BadgeVariant);

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_BADGE_CONFIG.color,
    );

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_BADGE_CONFIG.size,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_BADGE_CONFIG.radius,
    );

    const sizeClass = resolveClassKey(
      resolvedSizeKey,
      BADGE_HEIGHT_CLASS,
      FALLBACK_BADGE_CONFIG.size,
    );

    const paddingClass = resolveClassKey(
      resolvedSizeKey,
      BADGE_PADDING_CLASS,
      FALLBACK_BADGE_CONFIG.size,
    );

    const fontClass = resolveClassKey(
      resolvedSizeKey,
      BADGE_FONT_CLASS,
      FALLBACK_BADGE_CONFIG.size,
    );

    const gapClass = resolveClassKey(
      resolvedSizeKey,
      BADGE_GAP_CLASS,
      FALLBACK_BADGE_CONFIG.size,
    );

    const iconClass = resolveClassKey(
      resolvedSizeKey,
      BADGE_ICON_SIZE_CLASS,
      FALLBACK_BADGE_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey as Radius,
      RADIUS_CLASS,
      FALLBACK_BADGE_CONFIG.radius,
    );

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center shrink-0 whitespace-nowrap font-medium select-none",
          sizeClass,
          paddingClass,
          fontClass,
          gapClass,
          iconClass,
          radiusClass,
          resolveVariantClass(resolvedVariantKey, resolvedColorKey),
          className,
        )}
        {...props}>
        {/* A label replaces the visible content as the badge's name: the icon
            and any text are decoration next to it. Without a label the visible
            content is the name, which is what a text badge wants. */}
        {label ? (
          <>
            <span className="sr-only">{label}</span>
            <span
              aria-hidden="true"
              className={cn("inline-flex items-center", gapClass)}>
              {startContent}
              {children}
              {endContent}
            </span>
          </>
        ) : (
          <>
            {startContent}
            {children}
            {endContent}
          </>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";
