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
 * answers to the reader's preference, and to `isAnimated`. With the movement stopped the
 * content is not clipped: it is rendered once, inside a frame that scrolls and wraps, so
 * everything that does not fit can still be read — the platform's version of the web's still
 * frame. A reader who cannot rest a pointer on the frame stops the loop by focusing it, which
 * is the platform's statement of the web's `group-focus-within` pause.
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
  NATIVE_MARQUEE_STILL_FRAME_CLASS,
  NATIVE_MARQUEE_STILL_SET_CLASS,
  NATIVE_MARQUEE_TRACK_AXIS_CLASS,
  NATIVE_MARQUEE_TRACK_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import {
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  type LayoutChangeEvent,
  ScrollView,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useReduceMotion } from "../../../hooks/use-reduce-motion";
import { useAsheeNativeConfig } from "../../../provider/AsheeNativeProvider";
import { classNames } from "../../../utils/class-names";
import { resolveLength } from "../../../utils/resolve-length";
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
 * The primitive never hides the content it was given. While it moves, both copies are in the
 * tree and the second is kept out of the accessibility tree and out of the focus order, so a
 * reader hears and tabs to the items once while the loop still has something to move into
 * place. With the platform asking for less motion, or with `isAnimated` false, the content is
 * shown once and reads in place, in a frame that scrolls and wraps instead of clipping what
 * does not fit.
 *
 * @param props - The marquee's options and the platform's view props.
 * @param props.children - The items to show.
 * @param props.axis - The axis content moves along. Defaults to "x".
 * @param props.direction - The direction it moves in. Defaults to "forward".
 * @param props.speed - A preset or a number of seconds per cycle. Defaults to "normal".
 * @param props.gap - The gap between items, as a CSS length. Defaults to "1.5rem".
 * @param props.pauseOnHover - Whether focus inside the frame stops the movement. Defaults to
 * false. The platform has no pointer, so the pointer's half resolves and does nothing; the
 * focus half is the pause a keyboard or remote reader uses, and it is the platform's version
 * of the web's `group-focus-within` pause; see `NATIVE_MARQUEE_PAUSE_ON_HOVER_CLASS`.
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
  onFocus,
  onBlur,
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
  const [hasFocus, setHasFocus] = useState(false);

  // The web pauses the loop for a pointer resting on the frame and for keyboard focus inside
  // it (`group-focus-within`). A touch screen has no pointer to rest, so the platform's pause
  // is the focus one: a reader who moves through the content with a keyboard or a remote
  // stops the loop by landing on it, which is the mechanism WCAG 2.2.2 asks for.
  const isPaused = resolved.pauseOnHover && hasFocus;

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

    // A pause holds the frame where the platform stopped it, so the animated value is left
    // alone while focus is inside it. Resuming starts the next pass from the beginning: a
    // natively driven animation's position cannot be read back from JavaScript, and the loop
    // has no end for that to be visible against. This is the one place the platform differs
    // from the web, which resumes its CSS animation where it paused.
    if (!isPaused) {
      translate.setValue(from);
    }

    if (isPaused) {
      return;
    }

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
    durationSeconds,
    isPaused,
    moves,
    resolved.direction,
    resolvedGap,
    setExtent,
    translate,
  ]);

  /**
   * Render one copy of the content.
   *
   * The gap between items belongs to the copy, so one copy plus the gap is exactly the
   * distance the loop travels and the seam has nothing to jump.
   *
   * @param setIndex - 0 for the copy the reader reads, 1 for the copy the loop moves into
   * place.
   * @returns The rendered copy.
   */
  const renderSet = useCallback(
    (setIndex: number) => {
      const setPrefix = setIndex === 0 ? "primary" : "secondary";
      const isCopy = setIndex === 1;

      return (
        <View
          key={`${setPrefix}-set`}
          testID="marquee-set"
          // The copy is the same content read again: it stays on the screen the loop moves
          // through, but it is out of the accessibility tree and out of the focus order, so a
          // link inside a marquee is a tab stop once rather than twice.
          accessibilityElementsHidden={isCopy}
          importantForAccessibility={isCopy ? "no-hide-descendants" : "auto"}
          accessible={isCopy ? false : undefined}
          focusable={isCopy ? false : undefined}
          className={classNames(
            NATIVE_MARQUEE_SET_CLASS,
            (moves
              ? NATIVE_MARQUEE_SET_AXIS_CLASS
              : NATIVE_MARQUEE_STILL_SET_CLASS)[resolved.axis],
          )}
          style={{ gap: resolvedGap }}
          onLayout={isCopy ? undefined : measureSet}>
          {children.map((item, itemIndex) => {
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
    },
    [children, itemClassName, measureSet, moves, resolved.axis, resolvedGap],
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
      onFocus={(event) => {
        setHasFocus(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setHasFocus(false);
        onBlur?.(event);
      }}
      {...rest}>
      {moves ? (
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
          {renderSet(0)}
          {renderSet(1)}
        </Animated.View>
      ) : (
        // One copy, no duplicate, in a frame that scrolls and wraps: nothing the reader can
        // read is left outside the frame.
        <ScrollView
          testID="marquee-still-frame"
          className={NATIVE_MARQUEE_STILL_FRAME_CLASS[resolved.axis]}>
          {renderSet(0)}
        </ScrollView>
      )}
    </View>
  );
}
