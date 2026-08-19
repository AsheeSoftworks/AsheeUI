"use client";

import { cn } from "@asheeui/utils";
import { forwardRef, type ReactNode } from "react";
import { useAsheeConfig } from "../../../libs/context";
import type { Spacing } from "../../../theme/token/spacing/spacing-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveSpacingKey,
} from "../../../utils/resolve-token";
import {
  FALLBACK_FLEX_CONFIG,
  type FlexAlign,
  type FlexConfig,
  type FlexDirection,
  type FlexJustify,
} from "./flex-config";
import {
  FLEX_ALIGN_CLASS,
  FLEX_DIRECTION_CLASS,
  FLEX_GAP_CLASS,
  FLEX_JUSTIFY_CLASS,
} from "./flex-styles";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: keyof Spacing;
  wrap?: boolean;
  className?: string;
  children?: ReactNode;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    { direction, align, justify, gap, wrap, className, children, ...props },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.flex as FlexConfig | undefined;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedDirection = resolveCascade<FlexDirection>(
      direction,
      sectionConfig?.direction,
      undefined,
      FALLBACK_FLEX_CONFIG.direction,
    );

    const resolvedAlign = resolveCascade<FlexAlign>(
      align,
      sectionConfig?.align,
      undefined,
      FALLBACK_FLEX_CONFIG.align,
    );

    const resolvedJustify = resolveCascade<FlexJustify>(
      justify,
      sectionConfig?.justify,
      undefined,
      FALLBACK_FLEX_CONFIG.justify,
    );

    const resolvedGapKey = resolveSpacingKey(
      gap,
      sectionConfig?.gap,
      config.theme.spacing?.default,
      FALLBACK_FLEX_CONFIG.gap,
    );

    const isWrapped = resolveCascade<boolean>(
      wrap,
      sectionConfig?.wrap,
      undefined,
      FALLBACK_FLEX_CONFIG.wrap,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const directionClass = resolveClassKey(
      resolvedDirection,
      FLEX_DIRECTION_CLASS,
      FALLBACK_FLEX_CONFIG.direction,
    );

    const alignClass = resolveClassKey(
      resolvedAlign,
      FLEX_ALIGN_CLASS,
      FALLBACK_FLEX_CONFIG.align,
    );

    const justifyClass = resolveClassKey(
      resolvedJustify,
      FLEX_JUSTIFY_CLASS,
      FALLBACK_FLEX_CONFIG.justify,
    );

    const gapClass = resolveClassKey(
      resolvedGapKey,
      FLEX_GAP_CLASS,
      FALLBACK_FLEX_CONFIG.gap,
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionClass,
          alignClass,
          justifyClass,
          gapClass,
          isWrapped && "flex-wrap",
          sectionConfig?.className,
          className,
        )}
        {...props}>
        {children}
      </div>
    );
  },
);

Flex.displayName = "Flex";
