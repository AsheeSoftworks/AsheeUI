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

export interface MarqueeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode[];
  axis?: MarqueeAxis;
  direction?: MarqueeDirection;
  speed?: MarqueeSpeedPreset | number;
  gap?: string;
  pauseOnHover?: boolean;
  fadeEdges?: boolean;
  itemClassName?: string;
}

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
    const sectionConfig = config.components?.marquee as
      | MarqueeConfig
      | undefined;

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
          "group relative overflow-hidden",
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
