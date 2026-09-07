/**
 * Marquee component for AsheeUI.
 * This file provides the main Marquee component implementation, which renders
 * an animated scrolling container that displays content in a continuous loop.
 * It supports horizontal and vertical scrolling, configurable speed, direction,
 * gap, pause on hover, and edge fading effects. Visual tokens resolve through
 * the standard AsheeUI cascade system.
 */
"use client";

import { forwardRef, isValidElement, type ReactNode, useMemo } from "react";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveCascade } from "../../utils/resolve-token";
import {
  FALLBACK_MARQUEE_CONFIG,
  type MarqueeAxis,
  type MarqueeConfig,
  type MarqueeDirection,
  type MarqueeSpeedPreset,
} from "./marquee-config";
import {
  MARQUEE_FADE_END_CLASS,
  MARQUEE_FADE_START_CLASS,
  MARQUEE_SPEED_PRESETS,
} from "./marquee-styles";

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
 * @param props.itemClassName - Extra classes for each item.
 * @param props.className - Extra classes for the container.
 *
 * @example
 * ```tsx
 * import { Marquee } from "asheeui";
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

    // ─── 2. Speed & Track Setup ──────────────────────────────────────────────

    const durationSeconds =
      typeof resolvedSpeed === "number"
        ? resolvedSpeed
        : (MARQUEE_SPEED_PRESETS[resolvedSpeed] ??
          MARQUEE_SPEED_PRESETS.normal);

    const isVertical = resolvedAxis === "y";

    const renderedSets = useMemo(
      () =>
        [children, children].map((set, setIndex) => {
          const setPrefix = setIndex === 0 ? "primary" : "secondary";

          return (
            <div
              key={`${setPrefix}-set`}
              className={cn(
                "flex shrink-0",
                isVertical ? "flex-col" : "flex-row",
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
                  <div key={itemKey} className={cn("shrink-0", itemClassName)}>
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
          "group relative overflow-clip",
          isVertical ? "h-full" : "w-full",
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
            "flex",
            isVertical ? "flex-col" : "flex-row w-max",
            resolvedPauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={{
            gap: resolvedGap,
            animationName: isVertical ? "marquee-y" : "marquee-x",
            animationDuration: `${durationSeconds}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection:
              resolvedDirection === "reverse" ? "reverse" : "normal",
          }}>
          {renderedSets}
        </div>

        {resolvedFadeEdges && (
          <>
            <div
              className={cn(
                "absolute z-10 pointer-events-none",
                MARQUEE_FADE_START_CLASS[resolvedAxis],
              )}
            />
            <div
              className={cn(
                "absolute z-10 pointer-events-none",
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
