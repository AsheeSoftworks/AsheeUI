"use client";

import { cn } from "@asheeui/utils";
import {
  createElement,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Size } from "../../theme/token/token";
import type {
  FontWeight,
  LineHeight,
} from "../../theme/typography/typography-config";
import { resolveCascade, resolveClassKey } from "../../utils/resolve-token";
import {
  FALLBACK_TEXT_CONFIG,
  type TextAs,
  type TextConfig,
} from "./text-config";
import {
  TEXT_LINE_HEIGHT_CLASS,
  TEXT_SIZE_CLASS,
  TEXT_WEIGHT_CLASS,
} from "./text-styles";

// ─── Component Interface ──────────────────────────────────────────────────────

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextAs;
  size?: keyof Size;
  weight?: keyof FontWeight;
  lineHeight?: keyof LineHeight;
  className?: string;
  children?: ReactNode;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    { as, size, weight, lineHeight, className, style, children, ...props },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.text as TextConfig | undefined;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const tag = resolveCascade<TextAs>(
      as,
      sectionConfig?.as,
      undefined,
      FALLBACK_TEXT_CONFIG.as,
    );

    const resolvedSize = resolveCascade<keyof Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_TEXT_CONFIG.size,
    );

    const resolvedWeight = resolveCascade<keyof FontWeight>(
      weight,
      sectionConfig?.weight,
      undefined,
      FALLBACK_TEXT_CONFIG.weight,
    );

    const resolvedLineHeight = resolveCascade<keyof LineHeight>(
      lineHeight,
      sectionConfig?.lineHeight,
      undefined,
      FALLBACK_TEXT_CONFIG.lineHeight,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const sizeClass = resolveClassKey(
      resolvedSize,
      TEXT_SIZE_CLASS,
      FALLBACK_TEXT_CONFIG.size,
    );

    const weightClass = resolveClassKey(
      resolvedWeight,
      TEXT_WEIGHT_CLASS,
      FALLBACK_TEXT_CONFIG.weight,
    );

    const lineHeightClass = resolveClassKey(
      resolvedLineHeight,
      TEXT_LINE_HEIGHT_CLASS,
      FALLBACK_TEXT_CONFIG.lineHeight,
    );

    return createElement(
      tag,
      {
        ref,
        className: cn(
          sizeClass,
          weightClass,
          lineHeightClass,
          sectionConfig?.className,
          className,
        ),
        style,
        ...props,
      },
      children,
    );
  },
);

Text.displayName = "Text";
