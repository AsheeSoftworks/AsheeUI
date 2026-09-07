/**
 * Link component for AsheeUI.
 * This file provides the main Link component implementation, which renders
 * a navigational link with support for variants, colors, sizes, underline
 * behaviors, external link handling, and custom routing components like
 * Next.js Link or TanStack Router Link. Visual tokens resolve through
 * the standard AsheeUI cascade system.
 */
"use client";

import {
  type AnchorHTMLAttributes,
  type ElementType,
  forwardRef,
  type ReactNode,
} from "react";
import { ExternalLinkIcon } from "../../icons/ExternalLinkIcon";
import { useAsheeConfig } from "../../libs/context";
import type { Color, Size } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveClassKey } from "../../utils/resolve-token";
import {
  FALLBACK_LINK_CONFIG,
  type LinkConfig,
  type LinkUnderline,
  type LinkVariant,
} from "./link-config";
import {
  LINK_COLOR_CLASS,
  LINK_ICON_SIZE_CLASS,
  LINK_SIZE_CLASS,
  LINK_UNDERLINE_CLASS,
  LINK_VARIANT_CLASS,
} from "./link-styles";

type BaseLinkProps = LinkConfig &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "size">;

/**
 * Configuration options for the Link component.
 */
export interface LinkProps extends BaseLinkProps {
  /**
   * The destination URL of the link.
   */
  href?: string;

  /**
   * Whether the link points to an external resource.
   * When true, adds an external link icon and appropriate rel attributes.
   */
  isExternal?: boolean;

  /**
   * Whether the link is in a disabled state.
   * Disabled links cannot be clicked and appear dimmed.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon rendered before the link text.
   */
  startIcon?: ReactNode;

  /**
   * Icon rendered after the link text.
   * If not provided and isExternal is true, an ExternalLinkIcon is shown.
   */
  endIcon?: ReactNode;

  /**
   * The link text content.
   */
  children?: ReactNode;

  /**
   * Custom link component to use instead of the native <a> tag.
   * Useful for framework routing components like Next.js Link or TanStack Router Link.
   */
  linkComponent?: ElementType;

  /**
   * Additional props to pass to the custom link component (e.g., { prefetch: true }).
   * These take precedence over the component's own props.
   */
  linkProps?: Record<string, unknown>;
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
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.size - Font size scale. Defaults to "md".
 * @param props.underline - Underline behavior. Defaults to "hover".
 * @param props.isExternal - Whether the link is external. Defaults to false.
 * @param props.disabled - Whether the link is disabled. Defaults to false.
 * @param props.startIcon - Icon rendered before the link text.
 * @param props.endIcon - Icon rendered after the link text.
 * @param props.children - The link text content.
 * @param props.linkComponent - Custom link component for framework routing.
 * @param props.linkProps - Additional props for the custom link component.
 * @param props.className - Extra CSS classes for the link.
 * @param props.target - Native target attribute.
 * @param props.rel - Native rel attribute.
 *
 * @example
 * ```tsx
 * import { Link } from "asheeui";
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
 *   linkComponent={NextLink}
 *   linkProps={{ prefetch: true }}
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
      linkComponent,
      linkProps: linkPropsProp,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.link;

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
      href: disabled ? undefined : href,
      target: targetAttr,
      rel: relAttr,
      "aria-disabled": disabled,
      onClick: handleClick,
      className: linkClassName,
      style,
      ref, // forward ref to the custom component if it accepts it
      ...props, // any other native anchor attributes
    };

    // Merge with user‑supplied linkProps (take precedence)
    const mergedLinkProps = {
      ...baseLinkProps,
      ...(linkPropsProp || {}),
    };

    // Choose the component: custom or native <a>
    const LinkComponent = linkComponent || "a";

    // ─── 4. Render ──────────────────────────────────────────────────────────

    return (
      <LinkComponent {...mergedLinkProps}>
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
      </LinkComponent>
    );
  },
);

Link.displayName = "Link";
