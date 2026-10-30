/**
 * Tooltip component for the native package.
 *
 * The component satisfies the framework's tooltip contract: the same treatments, colour roles,
 * sizes, placements, arrow, offset and delay as the web tooltip. What differs is how a reader
 * asks for the hint and where it goes.
 *
 * A reader asks by **long press**, because there is no pointer to rest on the trigger; how long
 * they have to rest is the same delay the web uses, stated as the length of the platform's own
 * long press rather than as a hover timer. The hint stays while the press is held, which is what
 * resting on a trigger means, and then for the closing delay afterwards — the same `close` the
 * web counts while a pointer leaves, because a hide is only a timer on either platform.
 *
 * The hint is placed against the platform's measurement of its trigger rather than against a
 * coordinate: the trigger and the hint share a view, the platform reports that view's size, and
 * the hint is drawn at the edge the placement resolved to, at the distance the offset states. A
 * placement that names a side resolves to the vertical direction it reads from, which the shared
 * anchor map states.
 *
 * Because a control may claim the long press for itself, the hint is also stated as the
 * trigger's **accessibility hint**, so a reader using assistive technology is told what the
 * explanation is without having to discover the gesture at all. That statement is text, so it is
 * made only when `content` is a string: node content has no string to put on the trigger and is
 * read once the hint itself is open, which is a limitation of the platform's hint rather than a
 * choice about the reader. Content that must be reachable without the gesture is therefore
 * written as a string.
 */

import {
  type ColorRole,
  NATIVE_MESSAGE_SURFACE_CLASS,
  NATIVE_MESSAGE_TEXT_CLASS,
  NATIVE_RADIUS_CLASS,
  NATIVE_TOOLTIP_ALIGN_CLASS,
  NATIVE_TOOLTIP_ANCHOR,
  NATIVE_TOOLTIP_ARROW_CLASS,
  NATIVE_TOOLTIP_BUBBLE_CLASS,
  NATIVE_TOOLTIP_CONTAINER_CLASS,
  NATIVE_TOOLTIP_WRAPPER_CLASS,
  type Radius,
  resolveCascade,
  resolveMessageVariant,
  type Size,
  TOOLTIP_FONT_CLASS,
  TOOLTIP_PADDING_X_CLASS,
  TOOLTIP_PADDING_Y_CLASS,
  type TooltipPlacement,
  type Variant,
} from "@asheeui/core";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, View } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import { classNames } from "../../../utils/class-names";
import { Typography } from "../../typography/text/Text";
import {
  FALLBACK_NATIVE_TOOLTIP_CONFIG,
  type NativeTooltipConfig,
} from "./tooltip-config";

/**
 * Props for the native Tooltip.
 */
export interface TooltipProps extends NativeTooltipConfig {
  /**
   * What the hint says. Nothing is shown when it is empty.
   *
   * A string is also stated as the trigger's accessibility hint, so it can be read without
   * finding the gesture. Node content is read once the hint is open instead, because the
   * platform's hint is text and a node has none to state.
   */
  content: ReactNode;

  /** The control the hint belongs to. */
  children: ReactNode;

  /**
   * Whether the hint is switched off.
   *
   * @default false
   */
  isDisabled?: boolean;

  /** Platform styles for the wrapper, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A short explanation of the control it belongs to.
 *
 * @param props - The hint's options.
 * @param props.content - What the hint says.
 * @param props.children - The control it belongs to.
 * @param props.isDisabled - Whether the hint is switched off. Defaults to false.
 * @param props.variant - Treatment of the hint. Defaults to the configured value.
 * @param props.color - Colour role of the hint. Defaults to the configured value.
 * @param props.size - Size of the hint. Defaults to the configured value.
 * @param props.placement - Where the hint sits. Defaults to the configured value.
 * @param props.delay - How long a reader rests on the trigger first, and how long the hint stays
 * after the press ends. Defaults to the configured value.
 * @param props.offset - The distance from the trigger. Defaults to the configured value.
 * @param props.radius - Corner rounding. Defaults to the configured value.
 * @param props.showArrow - Whether the hint points at its trigger.
 * @returns The rendered hint and its trigger.
 *
 * @example
 * ```tsx
 * <Tooltip content="Invoices are kept for seven years">
 *   <Button>Archived</Button>
 * </Tooltip>
 * ```
 *
 * @see NativeTooltipConfig - The configuration type for component defaults.
 */
export function Tooltip({
  content,
  children,
  isDisabled = false,
  variant,
  color,
  size,
  placement,
  delay,
  offset,
  radius,
  showArrow,
  className,
  style,
}: TooltipProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components.tooltip;

  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_TOOLTIP_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<ColorRole>(
    color,
    sectionConfig?.color,
    undefined,
    FALLBACK_NATIVE_TOOLTIP_CONFIG.color,
  );
  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_TOOLTIP_CONFIG.size,
  );
  const resolvedPlacement = resolveCascade<TooltipPlacement>(
    placement,
    sectionConfig?.placement,
    undefined,
    FALLBACK_NATIVE_TOOLTIP_CONFIG.placement,
  );
  const resolvedDelay = resolveCascade<
    number | { open?: number; close?: number }
  >(
    delay,
    sectionConfig?.delay,
    undefined,
    FALLBACK_NATIVE_TOOLTIP_CONFIG.delay,
  );
  const resolvedOffset = resolveCascade<number>(
    offset,
    sectionConfig?.offset,
    undefined,
    FALLBACK_NATIVE_TOOLTIP_CONFIG.offset,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_TOOLTIP_CONFIG.radius,
  );
  const resolvedShowArrow = resolveCascade<boolean>(
    showArrow,
    sectionConfig?.showArrow,
    undefined,
    FALLBACK_NATIVE_TOOLTIP_CONFIG.showArrow,
  );

  // How long a reader rests on the trigger before the hint appears: the same delay the web
  // counts while a pointer rests there, stated as the length of the platform's long press.
  const longPressDelay =
    typeof resolvedDelay === "number"
      ? resolvedDelay
      : (resolvedDelay?.open ??
        (FALLBACK_NATIVE_TOOLTIP_CONFIG.delay as number));

  // How long the hint stays after the press ends. A number states both halves of the wait; an
  // object with no `close` closes at once, which is how the web reads the same object.
  const closeDelay =
    typeof resolvedDelay === "number"
      ? resolvedDelay
      : (resolvedDelay?.close ?? 0);

  const anchor = NATIVE_TOOLTIP_ANCHOR[resolvedPlacement];
  const messageVariant = resolveMessageVariant(resolvedVariant);
  const surfaceClass =
    NATIVE_MESSAGE_SURFACE_CLASS[messageVariant][resolvedColor];
  const textClass = NATIVE_MESSAGE_TEXT_CLASS[messageVariant][resolvedColor];

  const [isOpen, setIsOpen] = useState(false);
  const [triggerHeight, setTriggerHeight] = useState(0);

  // The closing delay is a timer, so it has to be called off when the reader comes back before
  // it elapses: otherwise a stale hide lands on a hint that has just been opened again.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(
    () => () => {
      if (closeTimer.current !== null) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    },
    [],
  );

  const handleLongPress = () => {
    cancelClose();
    setIsOpen(true);
  };

  const handlePressOut = () => {
    cancelClose();

    // A switched-off hint has nothing to hide gradually, and a zero close states that the hint
    // goes the moment the press ends — which is what the web reads from the same object.
    if (isDisabled || closeDelay <= 0) {
      setIsOpen(false);
      return;
    }

    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setIsOpen(false);
    }, closeDelay);
  };

  const isShowing = isOpen && Boolean(content) && !isDisabled;

  return (
    <View
      className={NATIVE_TOOLTIP_WRAPPER_CLASS}
      style={style}
      onLayout={(event) => setTriggerHeight(event.nativeEvent.layout.height)}>
      <Pressable
        delayLongPress={longPressDelay}
        onLongPress={isDisabled ? undefined : handleLongPress}
        onPressOut={handlePressOut}
        // A reader using assistive technology is told the hint without having to find the
        // gesture, which matters because a control may claim the press for itself. A hint the
        // consumer switched off is not stated at all, which is what switching it off means.
        // The platform's hint is text, so only a string can be stated here; node content is
        // read once the hint is open instead.
        accessibilityHint={
          isDisabled || typeof content !== "string" ? undefined : content
        }>
        {children}
      </Pressable>

      {isShowing && (
        <View
          // The hint is not interactive: it explains what is under it, and a press belongs to
          // that control rather than to the hint.
          pointerEvents="none"
          className={classNames(
            NATIVE_TOOLTIP_CONTAINER_CLASS,
            NATIVE_TOOLTIP_ALIGN_CLASS[anchor.align],
          )}
          style={
            anchor.direction === "above"
              ? { bottom: triggerHeight + resolvedOffset }
              : { top: triggerHeight + resolvedOffset }
          }>
          <View
            accessibilityRole="text"
            accessibilityLabel={
              typeof content === "string" ? content : undefined
            }
            className={classNames(
              NATIVE_TOOLTIP_BUBBLE_CLASS,
              TOOLTIP_PADDING_X_CLASS[resolvedSize],
              TOOLTIP_PADDING_Y_CLASS[resolvedSize],
              NATIVE_RADIUS_CLASS[resolvedRadius],
              surfaceClass,
              className,
            )}>
            {resolvedShowArrow && anchor.direction === "above" && (
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                className={classNames(NATIVE_TOOLTIP_ARROW_CLASS, surfaceClass)}
              />
            )}

            {typeof content === "string" ? (
              <Typography
                role="label"
                className={classNames(
                  TOOLTIP_FONT_CLASS[resolvedSize],
                  textClass,
                )}>
                {content}
              </Typography>
            ) : (
              content
            )}

            {resolvedShowArrow && anchor.direction === "below" && (
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                className={classNames(NATIVE_TOOLTIP_ARROW_CLASS, surfaceClass)}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}
