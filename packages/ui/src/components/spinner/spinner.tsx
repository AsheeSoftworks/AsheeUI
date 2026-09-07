/**
 * Spinner component for AsheeUI.
 * This file provides the main Spinner component implementation, which renders
 * an animated SVG loading indicator. It supports configurable size, color,
 * and animation speed through the standard AsheeUI cascade system. The spinner
 * is hidden from assistive technology by default and should be paired with
 * a visually hidden label for accessibility.
 */
"use client";

import { forwardRef, type SVGAttributes } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Color, Size } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveClassKey } from "../../utils/resolve-token";
import { FALLBACK_SPINNER_CONFIG, type SpinnerConfig } from "./spinner-config";
import { SPINNER_COLOR_CLASS, SPINNER_SIZE_CLASS } from "./spinner-styles";

/**
 * Configuration options for the Spinner component.
 */
type BaseSpinnerProps = SpinnerConfig &
  Omit<SVGAttributes<SVGSVGElement>, "color" | "className">;

export interface SpinnerProps extends BaseSpinnerProps {}

/**
 * An animated SVG loading indicator.
 *
 * Spinner renders a rotating circle using the current theme color.
 * Visual tokens (`size`, `color`, `speed`) resolve through the
 * standard AsheeUI cascade. The SVG is hidden from assistive
 * technology (`aria-hidden`); pair it with a visually hidden label or
 * text for meaningful loading feedback.
 *
 * The spinner uses a standard circular progress indicator design with
 * a semi-transparent track and a solid arc that rotates. The rotation
 * is powered by CSS animation with configurable duration.
 *
 * @param props - Spinner configuration options and SVG attributes.
 * @param props.size - Pixel-size scale. Defaults to "md".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.speed - Rotation duration. Defaults to "0.75s".
 * @param props.className - Extra classes for the SVG element.
 * @param props.style - Inline styles for the SVG element.
 *
 * @example
 * ```tsx
 * import { Spinner } from "asheeui";
 *
 * export function Example() {
 *   return <Spinner size="lg" color="primary" />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom speed and color
 * <Spinner size="sm" color="success" speed="1.2s" />
 * ```
 *
 * @example
 * ```tsx
 * // With loading text for accessibility
 * <div role="status">
 *   <Spinner />
 *   <span className="sr-only">Loading...</span>
 * </div>
 * ```
 *
 * @see SpinnerConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size, color, speed, className, style, ...props }, ref) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.spinner;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_SPINNER_CONFIG.size,
    );

    const resolvedColorKey = resolveCascade<Color>(
      color,
      sectionConfig?.color,
      config.defaultColor,
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
      resolvedColorKey,
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
