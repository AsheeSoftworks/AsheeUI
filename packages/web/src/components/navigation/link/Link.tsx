/**
 * Link component for AsheeUI.
 * This file provides the main Link component implementation, which renders
 * a navigational link with support for variants, colors, sizes, underline
 * behaviors, external link handling, and custom routing components like
 * Next.js Link or TanStack Router Link. Visual tokens resolve through
 * the standard AsheeUI cascade system.
 */
"use client";

import type { Color, Size } from "@asheeui/core";
import { resolveCascade, resolveClassKey } from "@asheeui/core";
import {
  type AnchorHTMLAttributes,
  type ElementType,
  forwardRef,
  type ReactNode,
} from "react";
import { ExternalLinkIcon } from "../../../icons/ExternalLinkIcon";
import { useAsheeConfig } from "../../../libs/context";
import {
  LINK_COLOR_CLASS,
  LINK_ICON_SIZE_CLASS,
  LINK_UNDERLINE_CLASS,
  LINK_VARIANT_CLASS,
} from "../../../styles/link";
import { LINK_SIZE_CLASS } from "../../../styles/portable";
import { cn } from "../../../utils/cn";
import {
  FALLBACK_LINK_CONFIG,
  type LinkConfig,
  type LinkUnderline,
  type LinkVariant,
} from "./link-config";

type BaseLinkProps = LinkConfig &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "size">;

/**
 * Configuration options for the Link component.
 */
export interface LinkProps extends BaseLinkProps {
  /**
   * The destination URL of the link.
   *
   * Ignored when `to` is also given; `to` is the more specific of the two.
   */
  href?: string | undefined;

  /**
   * A route destination, for a framework router passed through `component`.
   *
   * TanStack Router and React Router name a link's destination `to`, so a substituted `component` needs that
   * prop rather than `href`. When `component` is set this is forwarded as `to`; without a router it becomes
   * the native anchor's `href`, so the same call site works before and after a router exists.
   */
  to?: string | undefined;

  /**
   * Whether the link points to an external resource.
   * When true, adds an external link icon and appropriate rel attributes.
   */
  isExternal?: boolean | undefined;

  /**
   * Whether the link is in a disabled state.
   * Disabled links cannot be followed and appear dimmed, but they stay links: the
   * element keeps its destination and its role, so a keyboard user can still reach
   * it and it is announced as an unavailable link rather than as plain text. The
   * press is refused instead of the element being taken apart.
   *
   * @default false
   */
  disabled?: boolean | undefined;

  /**
   * Icon rendered before the link text.
   */
  startIcon?: ReactNode | undefined;

  /**
   * Icon rendered after the link text.
   * If not provided and isExternal is true, an ExternalLinkIcon is shown.
   */
  endIcon?: ReactNode | undefined;

  /**
   * The link text content.
   */
  children?: ReactNode | undefined;

  /**
   * Component that replaces the native anchor, such as a framework router link.
   *
   * The substitution API is shared with `Image` and `Form`: `component` names
   * the component and `componentProps` carries the props it needs.
   */
  component?: ElementType | undefined;

  /**
   * Additional props for `component` (for example `{ prefetch: true }`).
   * These take precedence over the props the framework passes itself.
   */
  componentProps?: Record<string, unknown> | undefined;

  /**
   * Called when the link is activated, under the name the platform package uses.
   *
   * `onClick` is the DOM's event and `onPress` is React Native's, and they are the same act:
   * the guarded handler already refuses a disabled link, so both names reach the same place.
   * When both are given, both run, `onClick` first.
   */
  onPress?: (() => void) | undefined;
}

/**
 * A navigational link with support for variants, colors, sizes, and
 * custom routing components.
 *
 * Link renders an anchor element with consistent styling and behavior.
 * It supports multiple visual variants, theme colors, size scales,
 * underline behaviors, and external link handling. The component can
 * also accept custom link components for framework-specific routing.
 *
 * Visual tokens resolve through the standard AsheeUI cascade: prop,
 * component config, global theme defaults, and the built-in fallback.
 *
 * The component automatically handles accessibility attributes including
 * aria-disabled for disabled links, and appropriate target/rel attributes
 * for external links.
 *
 * @param props - Link configuration options and native anchor props.
 * @param props.href - The destination URL.
 * @param props.variant - Visual style variant. Defaults to "default".
 * @param props.color - Theme accent color. Resolves through the global
 * `defaultColor` first, then "primary".
 * @param props.size - Font size scale. Defaults to "md".
 * @param props.underline - Underline behavior. Defaults to "hover".
 * @param props.isExternal - Whether the link is external. Defaults to false.
 * @param props.disabled - Whether the link is disabled. Defaults to false.
 * @param props.startIcon - Icon rendered before the link text.
 * @param props.endIcon - Icon rendered after the link text.
 * @param props.children - The link text content.
 * @param props.component - Component that replaces the native anchor.
 * @param props.componentProps - Additional props for that component.
 * @param props.className - Extra CSS classes for the link.
 * @param props.target - Native target attribute.
 * @param props.rel - Native rel attribute.
 *
 * @example
 * ```tsx
 * import { Link } from "@asheeui/web";
 *
 * export function Example() {
 *   return (
 *     <Link
 *       href="/about"
 *       color="primary"
 *       underline="hover"
 *     >
 *       About Us
 *     </Link>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With Next.js Link
 * import NextLink from "next/link";
 *
 * <Link
 *   href="/blog/post-1"
 *   component={NextLink}
 *   componentProps={{ prefetch: true }}
 *   isExternal={false}
 * >
 *   Read Post
 * </Link>
 * ```
 *
 * @example
 * ```tsx
 * // External link with icon
 * <Link
 *   href="https://example.com"
 *   isExternal
 *   color="secondary"
 * >
 *   Visit Example
 * </Link>
 * ```
 *
 * @see LinkConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      to,
      variant,
      color,
      size,
      underline,
      isExternal,
      disabled = false,
      startIcon,
      endIcon,
      children,
      className,
      style,
      target,
      rel,
      onClick,
      onPress,
      component,
      componentProps: componentPropsProp,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.link;

    // One destination, two spellings: `to` for a router component, `href` for everything else.
    const destination = href ?? to;

    // ─── 1. Token Resolvers ──────────────────────────────────────────────────

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_LINK_CONFIG.size,
    );

    const resolvedVariantKey = resolveCascade<LinkVariant>(
      variant,
      sectionConfig?.variant,
      undefined,
      FALLBACK_LINK_CONFIG.variant,
    );

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
      FALLBACK_LINK_CONFIG.color,
    );

    const resolvedUnderline = resolveCascade<LinkUnderline>(
      underline,
      sectionConfig?.underline,
      undefined,
      FALLBACK_LINK_CONFIG.underline,
    );

    const resolvedIsExternal =
      isExternal ??
      sectionConfig?.isExternal ??
      FALLBACK_LINK_CONFIG.isExternal;

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const colorClass =
      resolvedVariantKey === "muted"
        ? LINK_VARIANT_CLASS.muted
        : cn(
            resolveClassKey(
              resolvedColor,
              LINK_COLOR_CLASS,
              FALLBACK_LINK_CONFIG.color,
            ),
            resolveClassKey(
              resolvedVariantKey,
              LINK_VARIANT_CLASS,
              FALLBACK_LINK_CONFIG.variant,
            ),
          );

    const sizeClass = resolveClassKey(
      resolvedSizeKey,
      LINK_SIZE_CLASS,
      FALLBACK_LINK_CONFIG.size,
    );

    const iconSizeClass = resolveClassKey(
      resolvedSizeKey,
      LINK_ICON_SIZE_CLASS,
      FALLBACK_LINK_CONFIG.size,
    );

    const underlineClass = resolveClassKey(
      resolvedUnderline,
      LINK_UNDERLINE_CLASS,
      FALLBACK_LINK_CONFIG.underline,
    );

    const targetAttr = target ?? (resolvedIsExternal ? "_blank" : undefined);
    const relAttr =
      rel ??
      (resolvedIsExternal || targetAttr === "_blank"
        ? "noopener noreferrer"
        : undefined);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
      onPress?.();
    };

    // ─── 3. Build link props ────────────────────────────────────────────────

    const linkClassName = cn(
      "inline-flex items-center transition-colors duration-200 outline-none select-none shrink-0",
      "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xs",
      sizeClass,
      colorClass,
      underlineClass,
      disabled && "opacity-50 pointer-events-none cursor-not-allowed",
      className,
    );

    // Base props passed to both native <a> and custom component
    const baseLinkProps = {
      // A disabled link keeps its destination. Without a destination the anchor degrades to a
      // generic element: it loses the link role, `aria-disabled` stops being a disabled
      // link, and a keyboard user cannot reach it at all. The press is refused in
      // `handleClick` instead, which is how the rest of the library treats a disabled
      // control, and the pointer is refused by the disabled classes.
      // A substituted router gets the prop it expects (`to`); a native anchor always gets a URL, so `to`
      // alone renders something that works even before a router is wired up.
      ...(component && to ? { to } : { href: destination }),
      target: targetAttr,
      rel: relAttr,
      "aria-disabled": disabled,
      onClick: handleClick,
      className: linkClassName,
      style,
      ref, // forward ref to the custom component if it accepts it
      ...props, // any other native anchor attributes
    };

    // Merge with user-supplied componentProps (they take precedence)
    const mergedLinkProps = {
      ...baseLinkProps,
      ...(componentPropsProp || {}),
    };

    // Choose the component: the substitution component or the native anchor
    const Component = component || "a";

    // ─── 4. Render ──────────────────────────────────────────────────────────

    return (
      <Component {...mergedLinkProps}>
        {startIcon && (
          <span
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              iconSizeClass,
            )}>
            {startIcon}
          </span>
        )}

        {children}

        {endIcon ? (
          <span
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              iconSizeClass,
            )}>
            {endIcon}
          </span>
        ) : (
          resolvedIsExternal && (
            <ExternalLinkIcon
              className={cn("inline-block shrink-0", iconSizeClass)}
            />
          )
        )}
      </Component>
    );
  },
);

Link.displayName = "Link";
