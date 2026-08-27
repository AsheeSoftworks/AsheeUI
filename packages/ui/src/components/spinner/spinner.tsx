"use client";

import { cn } from "@asheeui/utils";
import { forwardRef, type SVGAttributes } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Color } from "../../shared/variant";
import { resolveCascade, resolveClassKey } from "../../utils/resolve-token";
import {
  FALLBACK_SPINNER_CONFIG,
  type SpinnerConfig,
  type SpinnerSizeKey,
} from "./spinner-config";
import { SPINNER_COLOR_CLASS, SPINNER_SIZE_CLASS } from "./spinner-styles";

export interface SpinnerProps extends SVGAttributes<SVGSVGElement> {
  size?: SpinnerSizeKey;
  color?: Color;
  speed?: string;
  className?: string;
}

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size, color, speed, className, style, ...props }, ref) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.spinner as
      | SpinnerConfig
      | undefined;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<SpinnerSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_SPINNER_CONFIG.size,
    );

    const resolvedColor = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor as Color,
      FALLBACK_SPINNER_CONFIG.color,
    );

    const resolvedSpeed = resolveCascade<string>(
      speed,
      sectionConfig?.speed,
      undefined,
      FALLBACK_SPINNER_CONFIG.speed,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const sizeClass = resolveClassKey(
      resolvedSizeKey,
      SPINNER_SIZE_CLASS,
      FALLBACK_SPINNER_CONFIG.size,
    );

    const colorClass = resolveClassKey(
      resolvedColor,
      SPINNER_COLOR_CLASS,
      FALLBACK_SPINNER_CONFIG.color,
    );

    return (
      <svg
        ref={ref}
        aria-hidden="true"
        className={cn(
          "animate-spin shrink-0",
          sizeClass,
          colorClass,
          sectionConfig?.className,
          className,
        )}
        style={{
          animationDuration: resolvedSpeed,
          ...style,
        }}
        viewBox="0 0 24 24"
        fill="none"
        {...props}>
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    );
  },
);

Spinner.displayName = "Spinner";
