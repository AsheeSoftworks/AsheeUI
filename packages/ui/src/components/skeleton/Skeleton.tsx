/**
 * Skeleton component for AsheeUI.
 * This file provides the Skeleton component, a loading placeholder whose
 * surface colour, radius and shimmer resolve through the standard AsheeUI
 * cascade system.
 */

"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Radius } from "../../shared";
import { RADIUS_CLASS } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveClassKey } from "../../utils/resolve-token";
import {
  FALLBACK_SKELETON_CONFIG,
  type SkeletonConfig,
} from "./skeleton-config";
import {
  SKELETON_ANIMATION_CLASS,
  SKELETON_BASE_CLASS,
} from "./skeleton-styles";

type BaseSkeletonProps = SkeletonConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "children">;

/**
 * Configuration options for the Skeleton component.
 */
export interface SkeletonProps extends BaseSkeletonProps {
  /**
   * Whether the placeholder stands in for a region that is loading rather than
   * appear as decoration.
   *
   * When true the placeholder becomes a labelled busy status, so assistive
   * technology is told that loading is in progress. When false it is hidden
   * from assistive technology, because a placeholder carries no information.
   *
   * @default false
   */
  isBusy?: boolean;

  /**
   * Text announced while the placeholder is a busy status.
   *
   * @default "Loading"
   */
  label?: string;
}

/**
 * A loading placeholder.
 *
 * Skeleton renders a neutral surface that stands in for content while it
 * loads. Size it with the standard layout classes, because it has no size axis
 * of its own: `className="h-40 w-full"` is the intended usage.
 *
 * Two accessibility contracts hold here. A decorative placeholder is hidden
 * from assistive technology, because it conveys nothing on its own. A
 * placeholder marked as busy is exposed as a labelled status instead, so a
 * consumer who needs the state announced gets it. Neither replaces a status
 * announcement for a wait the consumer knows will be long: use the framework's
 * notification or a status region for that.
 *
 * The shimmer is applied through the reduced-motion-safe variant, so it stops
 * for a consumer who asked for less motion without any script running.
 *
 * @param props - Skeleton configuration options and div attributes.
 * @param props.isBusy - Expose the placeholder as a labelled busy status. Defaults to false.
 * @param props.label - Text announced while busy. Defaults to "Loading".
 * @param props.radius - Corner rounding. Defaults to "sm".
 * @param props.isAnimated - Whether the placeholder shimmers. Defaults to true.
 * @param props.className - Extra classes applied last, which is where sizing belongs.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-40" />
 * ```
 *
 * @example
 * ```tsx
 * // The region is loading and the state should be announced.
 * <Skeleton isBusy label="Loading invoices" className="h-4 w-full" />
 * ```
 *
 * @see SkeletonConfig - The configuration type for component defaults.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      radius,
      isAnimated,
      isBusy = false,
      label = "Loading",
      className,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.skeleton as
      | SkeletonConfig
      | undefined;

    const resolvedRadiusKey = resolveCascade<Radius>(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_SKELETON_CONFIG.radius,
    );

    const resolvedAnimated = resolveCascade<boolean>(
      isAnimated,
      sectionConfig?.isAnimated,
      undefined,
      FALLBACK_SKELETON_CONFIG.isAnimated,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey as Radius,
      RADIUS_CLASS,
      FALLBACK_SKELETON_CONFIG.radius,
    );

    return (
      <div
        ref={ref}
        role={isBusy ? "status" : undefined}
        aria-busy={isBusy ? true : undefined}
        aria-hidden={isBusy ? undefined : true}
        className={cn(
          SKELETON_BASE_CLASS,
          resolvedAnimated && SKELETON_ANIMATION_CLASS,
          radiusClass,
          className,
        )}
        {...props}>
        {isBusy && <span className="sr-only">{label}</span>}
      </div>
    );
  },
);

Skeleton.displayName = "Skeleton";
