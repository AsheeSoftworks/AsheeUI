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

/**
 * Configuration options for the Spinner component.
 */
export interface SpinnerProps extends SVGAttributes<SVGSVGElement> {
  /** Pixel-size scale.
   *
   * @default "md"
   */
  size?: SpinnerSizeKey;
  /** Theme accent color.
   *
   * @default "primary"
   */
  color?: Color;
  /** CSS `animation-duration` for one rotation.
   *
   * @default "0.75s"
   */
  speed?: string;
  /** Extra classes merged with internal styles. */
  className?: string;
}

/**
 * An animated SVG loading indicator.
 *
 * Spinner renders a rotating circle using the current theme color.
 * Visual tokens (`size`, `color`, `speed`) resolve through the
 * standard AsheeUI cascade. The SVG is hidden from assistive
 * technology (`aria-hidden`); pair it with a visually hidden label or
 * text for meaningful loading feedback.
 *
 * @param props - Spinner configuration options and SVG attributes.
 * @param props.size - Pixel-size scale. Defaults to "md".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.speed - Rotation duration. Defaults to "0.75s".
 * @param props.className - Extra classes for the SVG element.
 *
 * @example
 * ```tsx
 * import { Spinner } from "asheeui";
 *
 * export function Example() {
 *   return <Spinner size="lg" color="primary" />;
 * }
 * ```
 */
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
