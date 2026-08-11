"use client";

import { useSettings } from "@ashee/settings";
import {
  type FontWeight,
  type LineHeight,
  useResponsiveVars,
} from "@ashee/theme";
import { cn } from "@ashee/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, type ReactNode, useMemo } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import { resolveValue } from "../../../utils/resolve-token";
import { ExternalLinkIcon } from "../../icons/ExternalLinkIcon";
import { defaultLinkSizeScale } from "./default-link-config";
import { flattenLinkSizeScale } from "./flatten-link-size-scale";
import type {
  LinkConfig,
  LinkSizeKey,
  LinkSizeScale,
  LinkUnderline,
  LinkVariant,
} from "./link-config";

// ─── Style Mappings ──────────────────────────────────────────────────────────

const VARIANT_CLASS: Record<LinkVariant, string> = {
  default: "text-foreground hover:text-foreground/80",
  primary: "text-primary hover:text-primary/80",
  muted: "text-muted-foreground hover:text-foreground",
  subtle: "text-foreground/80 hover:text-foreground",
  danger: "text-danger hover:text-danger/80",
};

const UNDERLINE_CLASS: Record<LinkUnderline, string> = {
  always: "underline underline-offset-4 decoration-current",
  hover: "no-underline hover:underline underline-offset-4 decoration-current",
  never: "no-underline",
};

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface LinkProps extends Omit<HTMLMotionProps<"a">, "size"> {
  href?: string;
  variant?: LinkVariant;
  size?: LinkSizeKey;
  underline?: LinkUnderline;
  weight?: keyof FontWeight;
  lineHeight?: keyof LineHeight;
  isExternal?: boolean;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  animation?: AnimationProp;
  children?: ReactNode;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      variant,
      size,
      underline,
      weight,
      lineHeight,
      isExternal,
      disabled = false,
      startIcon,
      endIcon,
      animation,
      children,
      className,
      style,
      target,
      rel,
      onClick,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const { settings } = useSettings();
    const sectionConfig = config.components?.link as LinkConfig | undefined;

    // Design Token Resolvers
    const sizeScale = (sectionConfig?.size ??
      defaultLinkSizeScale) as LinkSizeScale;
    const resolvedSizeKey = size ?? sizeScale.default;
    const responsiveVars = useMemo(
      () => flattenLinkSizeScale(sizeScale),
      [sizeScale],
    );
    useResponsiveVars(
      "ashee-link-tokens",
      responsiveVars,
      config.theme.breakpoints,
    );

    const resolvedVariant = resolveValue(
      variant,
      sectionConfig?.variant,
      "primary" as LinkVariant,
    );
    const resolvedUnderline = resolveValue(
      underline,
      sectionConfig?.underline,
      "hover" as LinkUnderline,
    );
    const resolvedWeight = resolveValue(
      weight,
      sectionConfig?.weight,
      "medium" as keyof FontWeight,
    );
    const resolvedLineHeight = resolveValue(
      lineHeight,
      sectionConfig?.lineHeight,
      "normal" as keyof LineHeight,
    );
    const resolvedIsExternal = isExternal ?? sectionConfig?.isExternal ?? false;

    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
      settings.enableAnimations,
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
      onClick?.(e as React.MouseEvent<HTMLAnchorElement, MouseEvent>);
    };

    return (
      <motion.a
        ref={ref}
        href={disabled ? undefined : href}
        target={targetAttr}
        rel={relAttr}
        aria-disabled={disabled}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center transition-colors duration-200 outline-none select-none",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xs",
          VARIANT_CLASS[resolvedVariant],
          UNDERLINE_CLASS[resolvedUnderline],
          disabled && "opacity-50 pointer-events-none cursor-not-allowed",
          sectionConfig?.className,
          className,
        )}
        style={{
          fontSize: `var(--ashee-link-${resolvedSizeKey}-font-s)`,
          gap: `var(--ashee-link-${resolvedSizeKey}-gap)`,
          fontWeight: config.theme.typography.weight[resolvedWeight],
          lineHeight: config.theme.typography.lineHeight[resolvedLineHeight],
          ...style,
        }}
        {...(motionProps as HTMLMotionProps<"a">)}
        {...props}>
        {startIcon && (
          <span
            className="inline-flex items-center justify-center shrink-0"
            style={{
              width: `var(--ashee-link-${resolvedSizeKey}-icon-s)`,
              height: `var(--ashee-link-${resolvedSizeKey}-icon-s)`,
            }}>
            {startIcon}
          </span>
        )}

        <span>{children}</span>

        {endIcon ? (
          <span
            className="inline-flex items-center justify-center shrink-0"
            style={{
              width: `var(--ashee-link-${resolvedSizeKey}-icon-s)`,
              height: `var(--ashee-link-${resolvedSizeKey}-icon-s)`,
            }}>
            {endIcon}
          </span>
        ) : (
          resolvedIsExternal && (
            <ExternalLinkIcon
              className="inline-block shrink-0"
              style={{
                width: `var(--ashee-link-${resolvedSizeKey}-icon-s)`,
                height: `var(--ashee-link-${resolvedSizeKey}-icon-s)`,
              }}
            />
          )
        )}
      </motion.a>
    );
  },
);

Link.displayName = "Link";
