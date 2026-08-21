"use client";

import { cn } from "@asheeui/utils";
import { forwardRef, type ReactNode } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Spacing } from "../../theme/token/spacing/spacing-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveSpacingKey,
} from "../../utils/resolve-token";
import {
  type ContainerConfig,
  type ContainerMaxWidth,
  FALLBACK_CONTAINER_CONFIG,
  type ScrollbarOverride,
} from "./container-config";
import {
  CONTAINER_MARGIN_CLASS,
  CONTAINER_MAX_WIDTH_CLASS,
  CONTAINER_PADDING_CLASS,
} from "./container-styles";

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

function resolveScrollbarVars(
  instance?: ScrollbarOverride,
  section?: ScrollbarOverride,
): CSSVars {
  const merged = { ...section, ...instance };
  const styleVars: CSSVars = {};
  if (merged.thumb) styleVars["--ashee-scrollbar-thumb"] = merged.thumb;
  if (merged.track) styleVars["--ashee-scrollbar-track"] = merged.track;
  if (merged.width) styleVars["--ashee-scrollbar-width"] = merged.width;
  if (merged.radius) styleVars["--ashee-scrollbar-radius"] = merged.radius;
  return styleVars;
}

export interface ContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  maxWidth?: ContainerMaxWidth;
  padding?: keyof Spacing;
  margin?: keyof Spacing;
  center?: boolean;
  scrollable?: boolean;
  scrollbar?: ScrollbarOverride;
  className?: string;
  style?: CSSVars;
  children?: ReactNode;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      maxWidth,
      padding,
      margin,
      center,
      scrollable,
      scrollbar,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.container as
      | ContainerConfig
      | undefined;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedMaxWidthKey = resolveCascade<ContainerMaxWidth>(
      maxWidth,
      sectionConfig?.maxWidth,
      undefined,
      FALLBACK_CONTAINER_CONFIG.maxWidth,
    );

    const resolvedPaddingKey = resolveSpacingKey(
      padding,
      sectionConfig?.padding,
      config.theme.spacing?.default,
      FALLBACK_CONTAINER_CONFIG.padding,
    );

    const resolvedMarginKey = resolveCascade<keyof Spacing>(
      margin,
      sectionConfig?.margin,
      undefined,
      FALLBACK_CONTAINER_CONFIG.margin,
    );

    const isCentered = resolveCascade<boolean>(
      center,
      sectionConfig?.center,
      undefined,
      FALLBACK_CONTAINER_CONFIG.center,
    );

    const isScrollable = resolveCascade<boolean>(
      scrollable,
      sectionConfig?.scrollable,
      undefined,
      FALLBACK_CONTAINER_CONFIG.scrollable,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const maxWidthClass = resolveClassKey(
      resolvedMaxWidthKey,
      CONTAINER_MAX_WIDTH_CLASS,
      FALLBACK_CONTAINER_CONFIG.maxWidth,
    );

    const paddingClass = resolveClassKey(
      resolvedPaddingKey,
      CONTAINER_PADDING_CLASS,
      FALLBACK_CONTAINER_CONFIG.padding,
    );

    const marginClass = resolveClassKey(
      resolvedMarginKey,
      CONTAINER_MARGIN_CLASS,
      FALLBACK_CONTAINER_CONFIG.margin,
    );

    const scrollbarVars = resolveScrollbarVars(
      scrollbar,
      sectionConfig?.scrollbar,
    );

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          maxWidthClass,
          paddingClass,
          marginClass,
          isCentered && "mx-auto",
          isScrollable && "scrollable overflow-y-auto",
          sectionConfig?.className,
          className,
        )}
        style={{
          ...scrollbarVars,
          ...style,
        }}
        {...props}>
        {children}
      </div>
    );
  },
);

Container.displayName = "Container";
