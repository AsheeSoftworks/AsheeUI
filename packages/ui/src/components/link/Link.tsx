"use client";

import { cn } from "@asheeui/utils";
import {
  type AnchorHTMLAttributes,
  type ElementType,
  forwardRef,
  type ReactNode,
} from "react";
import { ExternalLinkIcon } from "../../icons/ExternalLinkIcon";
import { useAsheeConfig } from "../../libs/context";
import type { Color } from "../../shared/variant";
import { resolveCascade, resolveClassKey } from "../../utils/resolve-token";
import {
  FALLBACK_LINK_CONFIG,
  type LinkConfig,
  type LinkSizeKey,
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

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "size"> {
  href?: string;
  variant?: LinkVariant;
  color?: Color;
  size?: LinkSizeKey;
  underline?: LinkUnderline;
  isExternal?: boolean;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;

  // NEW: Custom link component support (e.g., Next.js Link, TanStack Router Link)
  /** Custom link component to use instead of the native <a> tag. */
  linkComponent?: ElementType;
  /** Additional props to pass to the custom link component (e.g., { prefetch: true }). */
  linkProps?: Record<string, unknown>;
}

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
    const sectionConfig = config.components?.link as LinkConfig | undefined;

    // ─── 1. Token Resolvers ──────────────────────────────────────────────────

    const resolvedSizeKey = resolveCascade<LinkSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_LINK_CONFIG.size,
    );

    const resolvedVariant = resolveCascade<LinkVariant>(
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
      resolvedVariant === "muted"
        ? LINK_VARIANT_CLASS.muted
        : cn(
            resolveClassKey(
              resolvedColor,
              LINK_COLOR_CLASS,
              FALLBACK_LINK_CONFIG.color,
            ),
            resolveClassKey(
              resolvedVariant,
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
      sectionConfig?.className,
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
