/**
 * Spinner component for the native package.
 *
 * The component satisfies the framework's spinner contract: the same prop names, the
 * same options and the same meaning as the web spinner. What differs is the
 * mechanism, and the difference is the platform's rather than a preference: the web
 * rotates an SVG with a CSS animation, and this platform rotates a view with its own
 * animator, which is the only animation that runs here.
 *
 * The ring is drawn from classes rather than from a platform control on purpose. A
 * native activity indicator takes a colour *value* and the framework's contract names
 * a colour *role*, so a control that cannot resolve a role cannot honour the prop a
 * consumer sets — it would take the option and ignore it. A ring built from the
 * theme's classes honours `color` the same way the web does, and it turns for the same
 * duration both platforms chose.
 *
 * The indicator is hidden from assistive technology by default, like the web's, which
 * is why it takes a `label`: an indicator that reports something rather than merely
 * decorating takes its accessible name from it, and then announces itself as busy.
 */

import {
  type ColorRole,
  NATIVE_SPINNER_BASE_CLASS,
  NATIVE_SPINNER_HEAD_CLASS,
  NATIVE_SPINNER_SIZE_CLASS,
  NATIVE_SPINNER_TRACK_CLASS,
  resolveCascade,
  resolveSpinnerDurationMs,
  type Size,
} from "@asheeui/core";
import { useEffect, useRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Animated, Easing, View, type ViewProps } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import {
  FALLBACK_NATIVE_SPINNER_CONFIG,
  type NativeSpinnerConfig,
} from "./spinner-config";

/**
 * Props for the native Spinner.
 */
export interface SpinnerProps
  extends NativeSpinnerConfig,
    Omit<ViewProps, "children" | "style"> {
  /**
   * Text announced while the indicator reports a wait.
   *
   * When it is stated the indicator becomes a labelled busy status rather than
   * decoration; when it is absent the indicator is hidden from assistive technology,
   * so it can sit inside a control that already announces its own busy state without
   * renaming it.
   */
  label?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A rotating ring that says something is in progress.
 *
 * The ring resolves its density, its colour role and its speed through the standard
 * AsheeUI cascade, and turns for as long as it is mounted. Its rotation is the
 * platform's animator, so it runs on the platform's own thread and does not re-render
 * the tree in order to move.
 *
 * @param props - The spinner's options and the platform's view props.
 * @param props.size - Density. Defaults to `"md"`.
 * @param props.color - Colour role. Defaults to the platform's `defaultColor`.
 * @param props.speed - How long one rotation takes, as a CSS duration. Defaults to `"0.75s"`.
 * @param props.label - Text announced while it reports a wait. Defaults to none, which hides the indicator from assistive technology.
 * @param props.className - Extra classes applied last.
 * @returns The rendered indicator.
 *
 * @example
 * ```tsx
 * <Spinner label="Loading invoices" size="lg" color="danger" />
 * ```
 *
 * @see resolveSpinnerDurationMs - How the shared speed becomes the platform's duration.
 * @see NativeSpinnerConfig - The configuration type for component defaults.
 */
export function Spinner({
  size,
  color,
  speed,
  label,
  className,
  style,
  ...rest
}: SpinnerProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.spinner;

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_SPINNER_CONFIG.size,
  );
  const resolvedColor = resolveCascade<ColorRole>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_SPINNER_CONFIG.color,
  );
  const resolvedSpeed = resolveCascade<string>(
    speed,
    sectionConfig?.speed,
    undefined,
    FALLBACK_NATIVE_SPINNER_CONFIG.speed,
  );

  const ringClass = classNames(
    NATIVE_SPINNER_BASE_CLASS,
    NATIVE_SPINNER_SIZE_CLASS[resolvedSize],
    NATIVE_SPINNER_TRACK_CLASS[resolvedColor],
    NATIVE_SPINNER_HEAD_CLASS[resolvedColor],
  );

  // The rotation is a value rather than state: turning does not re-render the tree,
  // and the duration is read when the resolved speed changes rather than per frame.
  const duration = resolveSpinnerDurationMs(resolvedSpeed);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const turn = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    turn.start();

    return () => {
      turn.stop();
    };
  }, [duration, rotation]);

  return (
    // The animator's wrapper is invisible: the ring inside it keeps its classes, its
    // accessibility and everything a consumer passes, because NativeWind styles the
    // views it knows and the platform animator turns a value rather than a class.
    <Animated.View
      style={{
        transform: [
          {
            rotate: rotation.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "360deg"],
            }),
          },
        ],
      }}>
      <View
        accessible={label ? true : undefined}
        accessibilityRole={label ? "progressbar" : undefined}
        accessibilityLabel={label}
        accessibilityState={label ? { busy: true } : undefined}
        accessibilityElementsHidden={label ? undefined : true}
        importantForAccessibility={label ? "auto" : "no-hide-descendants"}
        className={classNames(ringClass, className)}
        style={style}
        {...rest}
      />
    </Animated.View>
  );
}
