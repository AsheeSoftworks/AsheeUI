/**
 * Toast item component for the native package.
 *
 * One message, drawn as a surface in its type's colour role with a glyph, a title, a
 * body, whatever action the consumer attached, and a dismiss control. The treatment
 * and the colour come from the shared message-surface maps, so a message looks like
 * the framework's other messages rather than like a component of its own invention.
 *
 * The message leaves by itself after the timeout its type states, and the leaving is
 * animated the way its arrival was. The web pauses that countdown while a pointer rests
 * on the message; the platform has no pointer to rest anywhere, so there is nothing to
 * pause — a reader who wants a message to stay sets a timeout of zero, which is what
 * the option is for.
 *
 * The movement is the platform's animator, driven on the native thread, exactly as the
 * spinner turns: the view that moves carries nothing else, and the child inside it
 * carries the classes, the props and the accessibility.
 */

import {
  NATIVE_ANNOUNCEMENT_LIVE_REGION,
  NATIVE_MESSAGE_SURFACE_CLASS,
  NATIVE_MESSAGE_TEXT_CLASS,
  NATIVE_RADIUS_CLASS,
  NATIVE_TOAST_ACTION_CLASS,
  NATIVE_TOAST_BASE_CLASS,
  NATIVE_TOAST_BODY_CLASS,
  NATIVE_TOAST_DISMISS_CLASS,
  NATIVE_TOAST_ICON_CLASS,
  NATIVE_TOAST_TYPE_GLYPH,
  type Radius,
  resolveMessageVariant,
  type Size,
  TOAST_FONT_CLASS,
  TOAST_PADDING_CLASS,
  TOAST_TITLE_FONT_CLASS,
  TOAST_TYPE_COLOR,
  TOAST_WIDTH_CLASS,
  type Variant,
} from "@asheeui/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import { classNames } from "../../utils/class-names";
import { Text } from "../text/Text";
import type { ToastItemData, ToastPlacement } from "./toast-config";

/**
 * Props for the native toast message.
 *
 * The provider resolves every option before it renders a message, so what arrives here
 * is already the value the cascade settled on.
 */
export interface ToastItemProps extends ToastItemData {
  /** Called when the message should be removed. */
  onDismiss: (id: string) => void;

  /** Placement of the message, which is the edge it animates from. */
  placement: ToastPlacement;

  /** Density of the message. */
  size: Size;

  /** Treatment of the message. */
  variant: Variant;

  /** Corner rounding of the message. */
  radius: Radius;

  /** Whether the message animates at all. */
  animated: boolean;
}

/**
 * How far a message travels as it appears, in points.
 *
 * The movement is short on purpose: a message arrives, it does not enter. The web
 * states the same movement as a keyframe animation per placement.
 */
const TOAST_TRAVEL = 12;

/**
 * One message.
 *
 * @param props - The message's resolved options.
 * @param props.message - What the message says.
 * @param props.onDismiss - Called when the message should be removed.
 * @param props.timeout - How long the message waits before it leaves.
 * @returns The rendered message.
 *
 * @see ToastProvider - The provider that queues and places it.
 */
export function ToastItem({
  id,
  title,
  message,
  type = "info",
  timeout,
  icon,
  action,
  dismissible = true,
  placement,
  size,
  variant,
  radius,
  animated,
  onDismiss,
}: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  // Arriving and leaving are one value, so departing reverses what arriving did rather
  // than inventing a second movement.
  const presence = useRef(new Animated.Value(animated ? 0 : 1)).current;

  useEffect(() => {
    if (!animated) {
      return;
    }

    Animated.timing(presence, {
      toValue: 1,
      duration: 150,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [animated, presence]);

  const handleDismiss = useCallback(() => {
    if (!animated) {
      onDismiss(id);
      return;
    }

    setIsExiting(true);

    Animated.timing(presence, {
      toValue: 0,
      duration: 150,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => onDismiss(id));
  }, [animated, id, onDismiss, presence]);

  useEffect(() => {
    // A message that states no timeout, or a timeout of zero or less, waits until the
    // reader dismisses it: that is what claiming the reader's attention means.
    if (!timeout || timeout <= 0 || isExiting) {
      return;
    }

    const timer = setTimeout(handleDismiss, timeout);

    return () => clearTimeout(timer);
  }, [handleDismiss, isExiting, timeout]);

  const colour = TOAST_TYPE_COLOR[type ?? "info"];
  // A message has no underline treatment, so the one it does not have resolves to its
  // nearest equivalent through the shared rule the alert reads too.
  const messageVariant = resolveMessageVariant(variant);
  const textClass = NATIVE_MESSAGE_TEXT_CLASS[messageVariant][colour];
  const fontClass = TOAST_FONT_CLASS[size];

  return (
    <Animated.View
      testID={`toast-${id}`}
      style={{
        opacity: presence,
        transform: [
          {
            translateY: presence.interpolate({
              inputRange: [0, 1],
              outputRange: [
                placement.startsWith("top-") ? -TOAST_TRAVEL : TOAST_TRAVEL,
                0,
              ],
            }),
          },
        ],
      }}>
      <View
        // A message states itself politely, which is what the web's `status` role does:
        // it is news, and news waits for a pause in what a reader is already hearing.
        accessible
        accessibilityLiveRegion={NATIVE_ANNOUNCEMENT_LIVE_REGION.status}
        className={classNames(
          NATIVE_TOAST_BASE_CLASS,
          TOAST_WIDTH_CLASS[size],
          TOAST_PADDING_CLASS[size],
          NATIVE_RADIUS_CLASS[radius],
          NATIVE_MESSAGE_SURFACE_CLASS[messageVariant][colour],
        )}>
        <View
          // The glyph repeats what the type says, so it is decoration rather than
          // information, and it is kept out of the announcement.
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className={NATIVE_TOAST_ICON_CLASS}>
          {icon ?? (
            <Text role="label" className={classNames(fontClass, textClass)}>
              {NATIVE_TOAST_TYPE_GLYPH[type ?? "info"]}
            </Text>
          )}
        </View>

        <View className={NATIVE_TOAST_BODY_CLASS}>
          {title && (
            <Text
              role="label"
              className={classNames(TOAST_TITLE_FONT_CLASS[size], textClass)}
              numberOfLines={1}>
              {title}
            </Text>
          )}
          <Text role="body-md" className={classNames(fontClass, textClass)}>
            {message}
          </Text>
          {action && (
            <View className={NATIVE_TOAST_ACTION_CLASS}>{action}</View>
          )}
        </View>

        {dismissible && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss notification"
            onPress={handleDismiss}
            className={NATIVE_TOAST_DISMISS_CLASS}>
            <Text role="label" className={classNames(fontClass, textClass)}>
              ✕
            </Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}
