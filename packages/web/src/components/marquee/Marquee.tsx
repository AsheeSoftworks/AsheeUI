/**
 * Marquee component for AsheeUI.
 * This file provides the main Marquee component implementation, which renders
 * an animated scrolling container that displays content in a continuous loop.
 * It supports horizontal and vertical scrolling, configurable speed, direction,
 * gap, pause on hover, and edge fading effects. Visual tokens resolve through
 * the standard AsheeUI cascade system.
 */
"use client";

import {
  cn,
  MARQUEE_AXIS_CLASS,
  MARQUEE_CLASS,
  MARQUEE_FADE_END_CLASS,
  MARQUEE_FADE_OVERLAY_CLASS,
  MARQUEE_FADE_START_CLASS,
  MARQUEE_ITEM_CLASS,
  MARQUEE_PAUSE_ON_HOVER_CLASS,
  MARQUEE_SET_AXIS_CLASS,
  MARQUEE_SET_CLASS,
  MARQUEE_SPEED_PRESETS,
  MARQUEE_TRACK_CLASS,
  MARQUEE_TRACK_X_CLASS,
  MARQUEE_TRACK_Y_CLASS,
  resolveCascade,
} from "@asheeui/core";
import { forwardRef, isValidElement, type ReactNode, useMemo } from "react";
import { useAsheeConfig } from "../../libs/context";
import { usePrefersReducedMotion } from "../../libs/use-prefers-reduced-motion";
import {
  FALLBACK_MARQUEE_CONFIG,
  type MarqueeAxis,
  type MarqueeConfig,
  type MarqueeDirection,
  type MarqueeSpeedPreset,
} from "./marquee-config";

type BaseMarqueeProps = MarqueeConfig &
  Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Configuration options for the Marquee component.
 */
export interface MarqueeProps extends BaseMarqueeProps {
  /**
   * The content to display in the marquee.
   * An array of React nodes that will be repeated for continuous scrolling.
   */
  children: ReactNode[];

  /**
   * Extra classes applied to each item.
   */
  itemClassName?: string;
}

/**
 * An animated scrolling container that displays content in a continuous loop.
 *
 * Marquee renders its children in a horizontal or vertical scrolling animation
 * that loops infinitely. It duplicates the content to create a seamless effect,
 * and supports configurable speed, direction, gap, pause on hover, and edge
 * fading.
 *
 * The component uses CSS keyframe animations for performance and smooth
 * scrolling. It automatically handles the duplication of content to create
 * the infinite scroll effect.
 *
 * @param props - Marquee configuration options and HTML div props.
 * @param props.children - An array of React nodes to display.
 * @param props.axis - The axis of the marquee. Defaults to "x".
 * @param props.direction - The scroll direction. Defaults to "forward".
 * @param props.speed - The animation speed. Defaults to "normal".
 * @param props.gap - The gap between items. Defaults to "1.5rem".
 * @param props.pauseOnHover - Whether to pause on hover. Defaults to false.
 * @param props.fadeEdges - Whether to fade edges. Defaults to false.
 * @param props.isAnimated - Whether the content moves. Defaults to true.
 * @param props.itemClassName - Extra classes for each item.
 * @param props.className - Extra classes for the container.
 *
 * @example
 * ```tsx
 * import { Marquee } from "@asheeui/web";
 *
 * export function Example() {
 *   const logos = [
 *     <div key="1">Logo 1</div>,
 *     <div key="2">Logo 2</div>,
 *     <div key="3">Logo 3</div>,
 *   ];
 *
 *   return (
 *     <Marquee
 *       speed="slow"
 *       gap="2rem"
 *       pauseOnHover
 *       fadeEdges
 *     >
 *       {logos}
 *     </Marquee>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Vertical marquee
 * <Marquee
 *   axis="y"
 *   direction="reverse"
 *   speed={20}
 *   gap="1rem"
 * >
 *   {items}
 * </Marquee>
 * ```
 *
 * @see MarqueeConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
export const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      children,
      axis,
      direction,
      speed,
      gap,
      pauseOnHover,
      fadeEdges,
      isAnimated,
      className,
      itemClassName,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.marquee;

    // ─── 1. Token Resolvers ──────────────────────────────────────────────────

    const resolvedAxis = resolveCascade<MarqueeAxis>(
      axis,
      sectionConfig?.axis,
      undefined,
      FALLBACK_MARQUEE_CONFIG.axis,
    );

    const resolvedDirection = resolveCascade<MarqueeDirection>(
      direction,
      sectionConfig?.direction,
      undefined,
      FALLBACK_MARQUEE_CONFIG.direction,
    );

    const resolvedSpeed = resolveCascade<MarqueeSpeedPreset | number>(
      speed,
      sectionConfig?.speed,
      undefined,
      FALLBACK_MARQUEE_CONFIG.speed,
    );

    const resolvedGap = resolveCascade<string>(
      gap,
      sectionConfig?.gap,
      undefined,
      FALLBACK_MARQUEE_CONFIG.gap,
    );

    const resolvedPauseOnHover = resolveCascade<boolean>(
      pauseOnHover,
      sectionConfig?.pauseOnHover,
      undefined,
      FALLBACK_MARQUEE_CONFIG.pauseOnHover,
    );

    const resolvedFadeEdges = resolveCascade<boolean>(
      fadeEdges,
      sectionConfig?.fadeEdges,
      undefined,
      FALLBACK_MARQUEE_CONFIG.fadeEdges,
    );

    const resolvedIsAnimated = resolveCascade<boolean>(
      isAnimated,
      sectionConfig?.isAnimated,
      undefined,
      FALLBACK_MARQUEE_CONFIG.isAnimated,
    );

    // ─── 2. Speed & Track Setup ──────────────────────────────────────────────

    const durationSeconds =
      typeof resolvedSpeed === "number"
        ? resolvedSpeed
        : (MARQUEE_SPEED_PRESETS[resolvedSpeed] ??
          MARQUEE_SPEED_PRESETS.normal);

    const isVertical = resolvedAxis === "y";

    // The loop is continuous motion, so it yields to the reduced-motion preference and to
    // the `isAnimated` option, and the content is then shown standing still (`REQ-089`).
    const prefersReducedMotion = usePrefersReducedMotion();

    const renderedSets = useMemo(
      () =>
        [children, children].map((set, setIndex) => {
          const setPrefix = setIndex === 0 ? "primary" : "secondary";

          return (
            <div
              key={`${setPrefix}-set`}
              className={cn(
                MARQUEE_SET_CLASS,
                MARQUEE_SET_AXIS_CLASS[resolvedAxis],
              )}
              style={{
                gap: resolvedGap,
              }}
              aria-hidden={setIndex === 1}>
              {set.map((item, itemIndex) => {
                const itemKey =
                  isValidElement(item) && item.key
                    ? `${setPrefix}-${item.key}`
                    : `${setPrefix}-item-${itemIndex}`;

                return (
                  <div
                    key={itemKey}
                    className={cn(MARQUEE_ITEM_CLASS, itemClassName)}>
                    {item}
                  </div>
                );
              })}
            </div>
          );
        }),
      [children, isVertical, resolvedGap, itemClassName],
    );

    return (
      <div
        ref={ref}
        className={cn(
          MARQUEE_CLASS,
          MARQUEE_AXIS_CLASS[resolvedAxis],
          className,
        )}
        {...props}>
        <style>{`
          @keyframes marquee-x {
            from { transform: translateX(0%); }
            to { transform: translateX(-50%); }
          }
          @keyframes marquee-y {
            from { transform: translateY(0%); }
            to { transform: translateY(-50%); }
          }
        `}</style>

        <div
          className={cn(
            MARQUEE_TRACK_CLASS,
            isVertical ? MARQUEE_TRACK_Y_CLASS : MARQUEE_TRACK_X_CLASS,
            resolvedPauseOnHover && MARQUEE_PAUSE_ON_HOVER_CLASS,
          )}
          style={{
            gap: resolvedGap,
            ...(prefersReducedMotion || !resolvedIsAnimated
              ? { animation: "none" }
              : {
                  animationName: isVertical ? "marquee-y" : "marquee-x",
                  animationDuration: `${durationSeconds}s`,
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  animationDirection:
                    resolvedDirection === "reverse" ? "reverse" : "normal",
                }),
          }}>
          {renderedSets}
        </div>

        {resolvedFadeEdges && (
          <>
            <div
              className={cn(
                MARQUEE_FADE_OVERLAY_CLASS,
                MARQUEE_FADE_START_CLASS[resolvedAxis],
              )}
            />
            <div
              className={cn(
                MARQUEE_FADE_OVERLAY_CLASS,
                MARQUEE_FADE_END_CLASS[resolvedAxis],
              )}
            />
          </>
        )}
      </div>
    );
  },
);

Marquee.displayName = "Marquee";
