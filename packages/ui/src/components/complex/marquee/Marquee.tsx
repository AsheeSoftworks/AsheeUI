"use client";

import { useSettings } from "@ashee/settings";
import { cn } from "@ashee/utils";
import {
  forwardRef,
  isValidElement,
  type ReactNode,
  useId,
  useMemo,
} from "react";
import { useAsheeConfig } from "../../../context";
import { resolveValue } from "../../../utils/resolve-token";
import type {
  MarqueeAxis,
  MarqueeConfig,
  MarqueeDirection,
  MarqueeSpeedPreset,
} from "./marquee-config";
import { resolveMarqueeMotion } from "./marquee-motion";

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

/**
 * Infinite looping marquee for images, cards, logos, etc. Supports both
 * horizontal and vertical scroll axes.
 *
 * Implementation note: the track renders `children` twice back-to-back and
 * animates a translate from 0% to -50% (or the reverse). Because the two
 * sets are identical, -50% always lands exactly on the seam between them,
 * giving a seamless loop with no width/height math required — unlike the
 * `items.length * 320` pixel calculation this replaces, this works
 * regardless of tile size or count.
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
    const { settings } = useSettings();
    const sectionConfig = config.components?.marquee as
      | MarqueeConfig
      | undefined;

    const resolvedAxis = resolveValue<MarqueeAxis>(
      axis,
      sectionConfig?.axis,
      "x",
    );
    const resolvedDirection = resolveValue<MarqueeDirection>(
      direction,
      sectionConfig?.direction,
      "forward",
    );
    const resolvedGap = resolveValue<string>(gap, sectionConfig?.gap, "1.5rem");
    const resolvedPauseOnHover = resolveValue<boolean>(
      pauseOnHover,
      sectionConfig?.pauseOnHover,
      true,
    );
    const resolvedFadeEdges = resolveValue<boolean>(
      fadeEdges,
      sectionConfig?.fadeEdges,
      true,
    );

    const motionConfig = resolveMarqueeMotion(
      speed ?? sectionConfig?.speed,
      settings.enableAnimations,
    );

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
            animationPlayState: resolvedPauseOnHover ? undefined : undefined,
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
                "absolute z-10 pointer-events-none bg-linear-to-r from-background to-transparent",
                isVertical
                  ? "top-0 left-0 w-full h-24 bg-linear-to-b"
                  : "top-0 left-0 h-full w-24",
              )}
            />
            <div
              className={cn(
                "absolute z-10 pointer-events-none bg-linear-to-l from-background to-transparent",
                isVertical
                  ? "bottom-0 left-0 w-full h-24 bg-linear-to-t"
                  : "top-0 right-0 h-full w-24",
              )}
            />
          </>
        )}
      </div>
    );
  },
);

Marquee.displayName = "Marquee";
