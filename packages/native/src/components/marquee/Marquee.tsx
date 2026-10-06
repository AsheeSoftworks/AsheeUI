/**
 * Marquee component for the native package.
 *
 * The component satisfies the framework's marquee contract: content that moves in a loop
 * along an axis, in a direction, at a speed, with a gap between its items, and with the
 * two options the platform cannot honour stated rather than stripped. What differs is how
 * the platform moves it.
 *
 * The web states a keyframe animation over a track it has already sized in its stylesheet,
 * and translates it by half. The platform has no stylesheet and no keyframes: it measures
 * the content once it is laid out, keeps its own animated value, and translates by the
 * measured length of one set plus the gap — which is the exact distance at which the second
 * copy has taken the first copy's place, so the loop has no seam. A marquee whose content
 * has not been measured yet stands still rather than jumping.
 *
 * The movement answers to the platform's motion setting (`useReduceMotion`) as the web's
 * answers to the reader's preference, and to `isAnimated`, and the content is then read in
 * place.
 */

import {
  MARQUEE_FALLBACK_GAP,
  MARQUEE_SPEED_PRESETS,
  NATIVE_MARQUEE_AXIS_CLASS,
  NATIVE_MARQUEE_CLASS,
  NATIVE_MARQUEE_FADE_CLASS,
  NATIVE_MARQUEE_ITEM_CLASS,
  NATIVE_MARQUEE_PAUSE_ON_HOVER_CLASS,
  NATIVE_MARQUEE_SET_AXIS_CLASS,
  NATIVE_MARQUEE_SET_CLASS,
  NATIVE_MARQUEE_TRACK_AXIS_CLASS,
  NATIVE_MARQUEE_TRACK_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import {
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  type LayoutChangeEvent,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useReduceMotion } from "../../hooks/use-reduce-motion";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { resolveLength } from "../../utils/resolve-length";
import {
  FALLBACK_NATIVE_MARQUEE_CONFIG,
  type NativeMarqueeConfig,
} from "./marquee-config";

/**
 * Props for the native Marquee.
 */
export interface MarqueeProps
  extends NativeMarqueeConfig,
    Omit<ViewProps, "children" | "style"> {
  /**
   * The items the marquee shows, in the order they are read.
   * The component copies them rather than asking the consumer to: a seamless loop needs the
   * content twice, and a consumer who duplicated it themselves would be the one maintaining
   * the seam.
   */
  children: ReactNode[];

  /** Extra classes applied to each item. */
  itemClassName?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Content that moves in a loop.
 *
 * The primitive never hides the content it was given: both copies are in the tree, and the
 * second is kept out of the accessibility tree rather than out of the screen, so a reader
 * hears the items once while the loop still has something to move into place. With the
 * platform asking for less motion, or with `isAnimated` false, the content stands still and
 * reads exactly the same.
 *
 * @param props - The marquee's options and the platform's view props.
 * @param props.children - The items to show.
 * @param props.axis - The axis content moves along. Defaults to "x".
 * @param props.direction - The direction it moves in. Defaults to "forward".
 * @param props.speed - A preset or a number of seconds per cycle. Defaults to "normal".
 * @param props.gap - The gap between items, as a CSS length. Defaults to "1.5rem".
 * @param props.pauseOnHover - Whether a resting pointer stops the movement. Defaults to
 * false. The platform has no pointer, so this resolves and does nothing; see
 * `NATIVE_MARQUEE_PAUSE_ON_HOVER_CLASS`.
 * @param props.fadeEdges - Whether the edges fade. Defaults to false. The platform paints
 * no gradient, so this resolves and does nothing; see `NATIVE_MARQUEE_FADE_CLASS`.
 * @param props.isAnimated - Whether the content moves. Defaults to true. The platform's
 * motion setting is honoured as well.
 * @param props.itemClassName - Extra classes for each item.
 * @returns The rendered marquee.
 *
 * @example
 * ```tsx
 * <Marquee speed="slow" gap="2rem">
 *   {logos.map((logo) => (
 *     <Logo key={logo.id} {...logo} />
 *   ))}
 * </Marquee>
 * ```
 *
 * @see useReduceMotion - The platform setting the loop yields to.
 */
export function Marquee({
  children,
  axis,
  direction,
  speed,
  gap,
  pauseOnHover,
  fadeEdges,
  isAnimated,
  itemClassName,
  className,
  style,
  ...rest
}: MarqueeProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeMarqueeConfig,
    Required<NativeMarqueeConfig>
  >(
    { axis, direction, speed, gap, pauseOnHover, fadeEdges, isAnimated },
    config.components.marquee,
    FALLBACK_NATIVE_MARQUEE_CONFIG,
  );

  const isVertical = resolved.axis === "y";
  const durationSeconds =
    typeof resolved.speed === "number"
      ? resolved.speed
      : (MARQUEE_SPEED_PRESETS[resolved.speed] ?? MARQUEE_SPEED_PRESETS.normal);

  // The shared contract states the gap as a CSS length, because it is one value for both
  // platforms; the platform reads it as its own number of units.
  const resolvedGap = resolveLength(resolved.gap, MARQUEE_FALLBACK_GAP);

  const reduceMotion = useReduceMotion();
  const moves = resolved.isAnimated && !reduceMotion;

  const translate = useRef(new Animated.Value(0)).current;
  const [setExtent, setSetExtent] = useState(0);

  const measureSet = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;

      setSetExtent(isVertical ? height : width);
    },
    [isVertical],
  );

  useEffect(() => {
    if (!moves || setExtent <= 0) {
      // Nothing measured, or nothing to move: the content stands at its first item rather
      // than at a position the platform guessed.
      translate.setValue(0);
      return;
    }

    // One set plus the gap is where the second copy sits where the first one began.
    const distance = setExtent + resolvedGap;
    const from = resolved.direction === "reverse" ? -distance : 0;
    const to = resolved.direction === "reverse" ? 0 : -distance;

    translate.setValue(from);

    const loop = Animated.loop(
      Animated.timing(translate, {
        toValue: to,
        duration: durationSeconds * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [
    moves,
    setExtent,
    resolvedGap,
    durationSeconds,
    resolved.direction,
    translate,
  ]);

  const sets = useMemo(
    () =>
      [children, children].map((set, setIndex) => {
        const setPrefix = setIndex === 0 ? "primary" : "secondary";
        const isCopy = setIndex === 1;

        return (
          <View
            key={`${setPrefix}-set`}
            testID="marquee-set"
            // The copy is the same content read again, so it is kept out of the
            // accessibility tree while staying on the screen the loop moves through.
            accessibilityElementsHidden={isCopy}
            importantForAccessibility={isCopy ? "no-hide-descendants" : "auto"}
            className={classNames(
              NATIVE_MARQUEE_SET_CLASS,
              NATIVE_MARQUEE_SET_AXIS_CLASS[resolved.axis],
            )}
            style={{ gap: resolvedGap }}
            onLayout={isCopy ? undefined : measureSet}>
            {set.map((item, itemIndex) => {
              const itemKey =
                isValidElement(item) && item.key
                  ? `${setPrefix}-${item.key}`
                  : `${setPrefix}-item-${itemIndex}`;

              return (
                <View
                  key={itemKey}
                  className={classNames(
                    NATIVE_MARQUEE_ITEM_CLASS,
                    itemClassName,
                  )}>
                  {item}
                </View>
              );
            })}
          </View>
        );
      }),
    [children, itemClassName, measureSet, resolved.axis, resolvedGap],
  );

  return (
    <View
      className={classNames(
        NATIVE_MARQUEE_CLASS,
        NATIVE_MARQUEE_AXIS_CLASS[resolved.axis],
        resolved.pauseOnHover && NATIVE_MARQUEE_PAUSE_ON_HOVER_CLASS,
        resolved.fadeEdges && NATIVE_MARQUEE_FADE_CLASS,
        className,
      )}
      style={style}
      {...rest}>
      <Animated.View
        testID="marquee-track"
        className={classNames(
          NATIVE_MARQUEE_TRACK_CLASS,
          NATIVE_MARQUEE_TRACK_AXIS_CLASS[resolved.axis],
        )}
        style={{
          gap: resolvedGap,
          transform: isVertical
            ? [{ translateY: translate }]
            : [{ translateX: translate }],
        }}>
        {sets}
      </Animated.View>
    </View>
  );
}
