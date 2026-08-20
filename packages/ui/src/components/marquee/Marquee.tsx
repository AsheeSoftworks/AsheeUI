"use client";

import { cn } from "@asheeui/utils";
import {
  forwardRef,
  isValidElement,
  type ReactNode,
  useId,
  useMemo,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { resolveCascade } from "../../utils/resolve-token";
import {
  FALLBACK_MARQUEE_CONFIG,
  type MarqueeAxis,
  type MarqueeConfig,
  type MarqueeDirection,
  type MarqueeSpeedPreset,
} from "./marquee-config";
import { resolveMarqueeMotion } from "./marquee-motion";
import {
  MARQUEE_FADE_END_CLASS,
  MARQUEE_FADE_START_CLASS,
} from "./marquee-styles";

export interface MarqueeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Items to loop — each is rendered as one tile in the track. */
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

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

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

    // ─── 2. Motion & Keyframe Resolution ─────────────────────────────────────

    const motionConfig = resolveMarqueeMotion(resolvedSpeed);
    const animationName = useId().replace(/[:]/g, "");
    const isVertical = resolvedAxis === "y";

    // forward: scrolls up/left (0% -> -50%). reverse: scrolls down/right.
    const fromPct = resolvedDirection === "forward" ? "0%" : "-50%";
    const toPct = resolvedDirection === "forward" ? "-50%" : "0%";

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
              style={{ gap: resolvedGap }}
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
          sectionConfig?.className,
          className,
        )}
        {...props}>
        {!motionConfig.isDisabled && (
          <style>
            {`
              @keyframes ${animationName} {
                from { transform: translate${isVertical ? "Y" : "X"}(${fromPct}); }
                to { transform: translate${isVertical ? "Y" : "X"}(${toPct}); }
              }
            `}
          </style>
        )}

        <div
          className={cn("flex", isVertical ? "flex-col" : "flex-row w-max")}
          style={{
            gap: resolvedGap,
            animation: motionConfig.isDisabled
              ? undefined
              : `${animationName} ${motionConfig.durationSeconds}s linear infinite`,
          }}>
          {renderedSets}
        </div>

        {resolvedPauseOnHover && !motionConfig.isDisabled && (
          <style>
            {`
              .group:hover [style*="${animationName}"] {
                animation-play-state: paused;
              }
            `}
          </style>
        )}

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
