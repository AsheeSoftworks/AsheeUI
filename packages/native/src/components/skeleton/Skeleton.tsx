/**
 * Skeleton component for the native package.
 *
 * The component satisfies the framework's skeleton contract: the same prop names, the
 * same options and the same meaning as the web skeleton. Its surface is the same token
 * the web paints, so a placeholder is the same weight of grey on both platforms, and
 * its corners resolve through the same radius scale.
 *
 * The pulse is the platform's own animator rather than a class. That is the one
 * difference the platform forces: the web gets its shimmer from a reduced-motion-safe
 * CSS animation the browser runs before hydration, and NativeWind cannot run a
 * keyframe animation here, so a class would be a class nothing executes. An
 * `Animated` value is the mechanism that does run, and it is a value rather than
 * state, so a breathing placeholder costs no re-renders.
 *
 * The accessibility contract is the web's, expressed the way the platform expresses
 * it: a decorative placeholder is hidden from assistive technology, because it conveys
 * nothing on its own, and a placeholder marked as busy becomes a labelled busy status
 * so a consumer who needs the wait announced gets it.
 */

import {
  NATIVE_RADIUS_CLASS,
  NATIVE_SKELETON_BASE_CLASS,
  type Radius,
  resolveCascade,
  resolveClassKey,
} from "@asheeui/core";
import { useEffect, useRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Animated, View, type ViewProps } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import {
  FALLBACK_NATIVE_SKELETON_CONFIG,
  type NativeSkeletonConfig,
} from "./skeleton-config";

/**
 * How long one half of the breath takes, in milliseconds.
 *
 * The beat is the component's own rather than the contract's: the option a consumer
 * has is whether the placeholder breathes at all, not how fast.
 */
const SKELETON_PULSE_DURATION_MS = 600;

/**
 * Props for the native Skeleton.
 */
export interface SkeletonProps
  extends NativeSkeletonConfig,
    Omit<ViewProps, "children" | "style"> {
  /**
   * Whether the placeholder stands in for a region that is loading, rather than
   * appearing as decoration.
   *
   * When true the placeholder becomes a labelled busy status, so assistive technology
   * is told that loading is in progress. When false it is hidden from assistive
   * technology, because a placeholder carries no information.
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

  /**
   * The space the placeholder occupies.
   *
   * A placeholder has no size axis of its own on either platform, so its dimensions
   * come from classes or from a platform style.
   */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A placeholder with the shape of content that has not arrived.
 *
 * Size it with the standard layout classes, because it has no size axis of its own:
 * `className="h-4 w-40"` is the intended usage. The corners and the pulse resolve
 * through the standard AsheeUI cascade.
 *
 * @param props - The placeholder's options and the platform's view props.
 * @param props.radius - Corner rounding. Defaults to `"sm"`.
 * @param props.isAnimated - Whether the placeholder pulses. Defaults to true.
 * @param props.isBusy - Expose the placeholder as a labelled busy status. Defaults to false.
 * @param props.label - Text announced while busy. Defaults to `"Loading"`.
 * @param props.className - Extra classes applied last, which is where sizing belongs.
 * @returns The rendered placeholder.
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
 * @see NativeSkeletonConfig - The configuration type for component defaults.
 */
export function Skeleton({
  radius,
  isAnimated,
  isBusy = false,
  label = "Loading",
  className,
  style,
  ...rest
}: SkeletonProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.skeleton;

  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_SKELETON_CONFIG.radius,
  );
  const resolvedAnimated = resolveCascade<boolean>(
    isAnimated,
    sectionConfig?.isAnimated,
    undefined,
    FALLBACK_NATIVE_SKELETON_CONFIG.isAnimated,
  );

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!resolvedAnimated) return;

    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: SKELETON_PULSE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: SKELETON_PULSE_DURATION_MS,
          useNativeDriver: true,
        }),
      ]),
    );

    breathe.start();

    return () => {
      breathe.stop();
    };
  }, [resolvedAnimated, opacity]);

  const classes = classNames(
    NATIVE_SKELETON_BASE_CLASS,
    resolveClassKey(
      resolvedRadius,
      NATIVE_RADIUS_CLASS,
      FALLBACK_NATIVE_SKELETON_CONFIG.radius,
    ),
    className,
  );

  return (
    // The surface keeps its classes and the animation keeps to the platform's own
    // wrapper, because NativeWind styles the views it knows and not the animator's.
    <Animated.View style={resolvedAnimated ? { opacity } : undefined}>
      <View
        accessible={isBusy ? true : undefined}
        accessibilityRole={isBusy ? "progressbar" : undefined}
        accessibilityState={isBusy ? { busy: true } : undefined}
        accessibilityLabel={isBusy ? label : undefined}
        accessibilityElementsHidden={isBusy ? undefined : true}
        importantForAccessibility={isBusy ? "auto" : "no-hide-descendants"}
        className={classes}
        style={style}
        {...rest}
      />
    </Animated.View>
  );
}
