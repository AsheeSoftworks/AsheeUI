/**
 * Badge component for AsheeUI.
 * This file provides the Badge component, a compact status or label indicator
 * whose colours, variant, size, and radius resolve through the standard
 * AsheeUI cascade system.
 */

"use client";

import type { Color, Radius, Size, Variant } from "@asheeui/core";
import {
  cn,
  resolveBadgeVariant,
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
  resolveVariantClass,
} from "@asheeui/core";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import {
  BADGE_BASE_CLASS,
  BADGE_FONT_CLASS,
  BADGE_GAP_CLASS,
  BADGE_HEIGHT_CLASS,
  BADGE_ICON_SIZE_CLASS,
  BADGE_PADDING_CLASS,
  BADGE_SLOT_CLASS,
} from "../../../styles/badge";
import { RADIUS_CLASS } from "../../../styles/radius";
import {
  type BadgeConfig,
  type BadgeVariant,
  FALLBACK_BADGE_CONFIG,
} from "./badge-config";

type BaseBadgeProps = BadgeConfig &
  Omit<HTMLAttributes<HTMLSpanElement>, "color" | "content">;

/**
 * Whether the badge has content of its own to show.
 *
 * A `null`, `undefined`, boolean or empty-string child draws nothing, and a badge in
 * that state is the icon-only badge `label` exists to name. Anything else — text, a
 * node, a list — is content the reader can see, and therefore the badge's name.
 *
 * @param children - The badge's content.
 * @returns `true` when the badge draws content of its own.
 */
function hasContent(children: ReactNode): boolean {
  if (
    children === null ||
    children === undefined ||
    typeof children === "boolean"
  ) {
    return false;
  }

  if (typeof children === "string") return children.trim().length > 0;

  return true;
}

/**
 * Configuration options for the Badge component.
 */
export interface BadgeProps extends BaseBadgeProps {
  /**
   * Badge content.
   * Typically a short piece of text. Omit it when the badge shows only an icon
   * and pass `label` instead so the badge still has an accessible name.
   */
  children?: ReactNode | undefined;

  /**
   * Text that stands in for the badge's content.
   * Use it when the badge shows only an icon: the text is rendered for
   * assistive technology and the visible content is treated as decoration. A
   * badge with visible text does not need it, because its text is its content.
   *
   * It names a badge that has no content of its own. When `children` is given
   * as well, the content wins: it is what the reader sees, so it is also what
   * assistive technology reads, and `label` is ignored (a development warning
   * says so). The pair never leaves the badge announcing a name the visible
   * text contradicts.
   */
  label?: string | undefined;

  /**
   * Content rendered before the badge text, typically an icon.
   */
  startContent?: ReactNode | undefined;

  /**
   * Content rendered after the badge text, typically an icon.
   */
  endContent?: ReactNode | undefined;
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
 * Its content is its name. `label` names the badge that has none — an
 * icon-only one — and is left out of the reading when visible content is
 * there, so the badge never announces a name its text contradicts.
 *
 * Consumer `className` is appended last, so it can restyle or reposition the
 * badge without fighting the framework's classes.
 *
 * @param props - Badge configuration options and span attributes.
 * @param props.children - Badge text or content, which is also its name.
 * @param props.label - Name of an icon-only badge. Ignored when `children` is
 * given, with a development warning.
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

    // The treatment the cascade produces may be one a badge cannot express, so the
    // shared rule lands it on the nearest it can before any class is looked up.
    const resolvedVariantKey: BadgeVariant = resolveBadgeVariant(
      resolveCascade<Variant>(
        variant,
        sectionConfig?.variant,
        config.defaultVariant,
        FALLBACK_BADGE_CONFIG.variant,
      ),
    );

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

    // A label names the badge that has nothing visible to be named by. When the
    // badge does draw content, that content is what the reader sees, so it is
    // what assistive technology reads too: the two never disagree.
    const showsLabel = Boolean(label) && !hasContent(children);
    const ignoresLabel = Boolean(label) && hasContent(children);

    useEffect(() => {
      if (!ignoresLabel) return;

      console.warn(
        "[Badge] `label` is ignored because `children` is given: the visible " +
          "content is the badge's name, and an `aria-hidden` copy beside a label " +
          "would announce a name the text contradicts. Pass the icon as " +
          "`startContent` and drop `children` to name an icon-only badge.",
      );
    }, [ignoresLabel]);

    // The icon slot states the density's box and the drawing inside it, so an icon
    // is the same size here as it is in a chip, whatever node the consumer passed.
    const iconSlot = (content: ReactNode) =>
      hasContent(content) ? (
        <span className={cn(BADGE_SLOT_CLASS, iconClass)}>{content}</span>
      ) : null;

    return (
      <span
        ref={ref}
        className={cn(
          BADGE_BASE_CLASS,
          sizeClass,
          paddingClass,
          fontClass,
          gapClass,
          radiusClass,
          resolveVariantClass(resolvedVariantKey, resolvedColorKey),
          className,
        )}
        {...props}>
        {/* A label names an icon-only badge: the icon and the markup beside it
            are decoration next to the name. Without one the visible content is
            the name, which is what a text badge wants. */}
        {showsLabel ? (
          <>
            <span className="sr-only">{label}</span>
            <span
              aria-hidden="true"
              className={cn("inline-flex items-center", gapClass)}>
              {iconSlot(startContent)}
              {children}
              {iconSlot(endContent)}
            </span>
          </>
        ) : (
          <>
            {iconSlot(startContent)}
            {children}
            {iconSlot(endContent)}
          </>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";
