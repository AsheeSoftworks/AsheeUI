"use client";

import { cn } from "@asheeui/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useAsheeConfig } from "../../../libs/context";
import type {
  FontWeight,
  LetterSpacing,
  LineHeight,
} from "../../../theme/typography/typography-config";
import { resolveCascade, resolveClassKey } from "../../../utils/resolve-token";
import {
  FALLBACK_HEADING_CONFIG,
  type HeadingConfig,
  type HeadingLevel,
} from "./heading-config";
import {
  HEADING_LETTER_SPACING_CLASS,
  HEADING_LEVEL_CLASS,
  HEADING_LINE_HEIGHT_CLASS,
  HEADING_WEIGHT_CLASS,
} from "./heading-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: HeadingLevel;
  weight?: keyof FontWeight;
  lineHeight?: keyof LineHeight;
  letterSpacing?: keyof LetterSpacing;
  className?: string;
  children?: ReactNode;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level,
      as,
      weight,
      lineHeight,
      letterSpacing,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.heading as
      | HeadingConfig
      | undefined;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedLevel = resolveCascade<HeadingLevel>(
      level,
      sectionConfig?.level,
      undefined,
      FALLBACK_HEADING_CONFIG.level,
    );

    const resolvedWeight = weight ?? sectionConfig?.weight;
    const resolvedLineHeight = lineHeight ?? sectionConfig?.lineHeight;
    const resolvedLetterSpacing = letterSpacing ?? sectionConfig?.letterSpacing;

    // Semantic HTML Tag Assignment
    const tagLevel = as ?? resolvedLevel;
    const Tag = `h${tagLevel}` as const;

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const levelClass = resolveClassKey(
      resolvedLevel,
      HEADING_LEVEL_CLASS,
      FALLBACK_HEADING_CONFIG.level,
    );

    const weightClass = resolvedWeight
      ? resolveClassKey(resolvedWeight, HEADING_WEIGHT_CLASS, "bold")
      : "";

    const lineHeightClass = resolvedLineHeight
      ? resolveClassKey(resolvedLineHeight, HEADING_LINE_HEIGHT_CLASS, "short")
      : "";

    const letterSpacingClass = resolvedLetterSpacing
      ? resolveClassKey(
          resolvedLetterSpacing,
          HEADING_LETTER_SPACING_CLASS,
          "tight",
        )
      : "";

    return (
      <Tag
        ref={ref}
        className={cn(
          "text-foreground",
          levelClass,
          weightClass,
          lineHeightClass,
          letterSpacingClass,
          sectionConfig?.className,
          className,
        )}
        style={style}
        {...props}>
        {children}
      </Tag>
    );
  },
);

Heading.displayName = "Heading";
