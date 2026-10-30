/**
 * Chip component for the native package.
 *
 * The component satisfies the framework's chip contract: a compact token with the same
 * optional avatar, leading icon, status dot, trailing icon and remove control as the web
 * chip, with the same diameter, rounding, treatment and colour axes. What differs is how
 * the platform says the things it can say.
 *
 * A removable chip is a control, so on the platform the whole token is a `Pressable` with
 * the remove control as its own pressable inside it, each announcing its own name:
 * "React" reads once and "Remove React" reads once, rather than a single run-on label. The
 * remove control is a character rather than a drawing, because this package ships no icon
 * set and the framework's native components already draw their affordances from text (the
 * stepper's tick, the picker's check, the alert's dismiss). A consumer who wants a drawing
 * passes `closeIcon`, and the character is what stands in its place when they do not.
 */

import {
  type Color,
  type Radius,
  resolveCascade,
  resolveChipVariant,
  resolveClassKey,
  resolvePress,
  type Size,
  type Variant,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type {
  GestureResponderEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from "react-native";
import { Pressable, View } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import {
  NATIVE_CHIP_AVATAR_CLASS,
  NATIVE_CHIP_BASE_CLASS,
  NATIVE_CHIP_CLOSE_CLASS,
  NATIVE_CHIP_CLOSE_GLYPH,
  NATIVE_CHIP_DISABLED_CLASS,
  NATIVE_CHIP_DOT_CLASS,
  NATIVE_CHIP_DOT_SHAPE_CLASS,
  NATIVE_CHIP_FONT_CLASS,
  NATIVE_CHIP_GAP_CLASS,
  NATIVE_CHIP_ICON_SIZE_CLASS,
  NATIVE_CHIP_PADDING_CLASS,
  NATIVE_CHIP_SLOT_CLASS,
  NATIVE_CHIP_TEXT_CLASS,
  NATIVE_CHIP_VARIANT_CLASS,
} from "../../../styles/chip";
import { NATIVE_RADIUS_CLASS } from "../../../styles/radius";
import { classNames } from "../../../utils/class-names";
import { Typography } from "../../typography/text/Text";
import {
  FALLBACK_NATIVE_CHIP_CONFIG,
  type NativeChipConfig,
} from "./chip-config";
import { NATIVE_CHIP_AVATAR_SIZE_CLASS } from "./chip-styles";

/**
 * Props for the native Chip.
 */
export interface ChipProps
  extends NativeChipConfig,
    Omit<ViewProps, "children" | "style"> {
  /** Whether the chip is disabled. Defaults to false. */
  isDisabled?: boolean;

  /** Leading icon, rendered before the content. */
  startIcon?: ReactNode;

  /** Trailing icon, rendered after the content and hidden when closable. */
  endIcon?: ReactNode;

  /** Avatar node rendered before the content, replacing `startIcon`. */
  avatar?: ReactNode;

  /**
   * Renders a small status dot.
   * Pass `true` for the current colour, or a colour string for a one-off dot.
   */
  dot?: boolean | string;

  /**
   * When provided, renders a remove control that fires this callback.
   * Makes the chip closable.
   */
  onClose?: () => void;

  /** Custom remove control shown inside the close button. */
  closeIcon?: ReactNode;

  /**
   * Accessible name of the remove control.
   * A list of chips needs each remove control to say what it removes, so pass the
   * chip's own subject, for example `"Remove invoice.pdf"`.
   *
   * @default "Remove chip"
   */
  closeLabel?: string;

  /**
   * When provided, makes the whole chip pressable and fires this callback.
   */
  onPress?: () => void;

  /**
   * The web's name for the same act.
   *
   * Either name makes the chip a control, which is what the web chip states: a chip with
   * `onClick` is pressable, and one without is a token. Both run when both are given,
   * `onClick` first.
   */
  onClick?: (event: GestureResponderEvent) => void;

  /** The chip's label. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A compact token that represents an input, a choice or an attribute.
 *
 * @param props - The chip's options and the platform's view props.
 * @param props.variant - Visual treatment. Defaults to the configured value.
 * @param props.color - Colour role. Defaults to the configured value.
 * @param props.size - Density. Defaults to the configured value.
 * @param props.radius - Corner rounding. Defaults to the configured value.
 * @param props.isDisabled - Disable interaction and dim the chip. Defaults to false.
 * @param props.onClose - Makes the chip closable.
 * @param props.onPress - Makes the whole chip pressable.
 * @returns The rendered token.
 *
 * @example
 * ```tsx
 * <Chip color="success" onClose={() => remove("react")} closeLabel="Remove React">
 *   React
 * </Chip>
 * ```
 *
 * @see NativeChipConfig - The configuration type for component defaults.
 */
export function Chip({
  variant,
  color,
  size,
  radius,
  isDisabled = false,
  startIcon,
  endIcon,
  avatar,
  dot,
  onClose,
  closeIcon,
  closeLabel = "Remove chip",
  onClick,
  onPress,
  children,
  className,
  style,
  ...rest
}: ChipProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components.chip;

  // The cascade's last two tiers belong to the platform rather than to the chip, so what
  // comes out of it may be a treatment a chip cannot express; `resolveChipVariant` is the
  // shared rule that lands it on the nearest one it can, so the class look-up below is
  // always a look-up rather than a fallback.
  const resolvedVariant = resolveChipVariant(
    resolveCascade<Variant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant,
      FALLBACK_NATIVE_CHIP_CONFIG.variant,
    ),
  );
  const resolvedColor = resolveCascade<Color>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_CHIP_CONFIG.color,
  );
  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_CHIP_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_CHIP_CONFIG.radius,
  );

  const paddingClass = resolveClassKey(
    resolvedSize,
    NATIVE_CHIP_PADDING_CLASS,
    FALLBACK_NATIVE_CHIP_CONFIG.size,
  );
  const gapClass = resolveClassKey(
    resolvedSize,
    NATIVE_CHIP_GAP_CLASS,
    FALLBACK_NATIVE_CHIP_CONFIG.size,
  );
  const fontClass = resolveClassKey(
    resolvedSize,
    NATIVE_CHIP_FONT_CLASS,
    FALLBACK_NATIVE_CHIP_CONFIG.size,
  );
  const iconSizeClass = resolveClassKey(
    resolvedSize,
    NATIVE_CHIP_ICON_SIZE_CLASS,
    FALLBACK_NATIVE_CHIP_CONFIG.size,
  );
  // An avatar is a picture rather than a glyph, so it gets its own, larger box. Using
  // the icon's map here would draw a face at 12 points.
  const avatarSizeClass = resolveClassKey(
    resolvedSize,
    NATIVE_CHIP_AVATAR_SIZE_CLASS,
    FALLBACK_NATIVE_CHIP_CONFIG.size,
  );
  const radiusClass = resolveClassKey(
    resolvedRadius,
    NATIVE_RADIUS_CLASS,
    FALLBACK_NATIVE_CHIP_CONFIG.radius,
  );

  const isInteractive = Boolean(onPress || onClick);

  return (
    <Pressable
      accessibilityRole={isInteractive ? "button" : undefined}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled || !isInteractive}
      onPress={
        isDisabled
          ? undefined
          : (pressEvent) => resolvePress({ onClick, onPress }, pressEvent)
      }
      className={classNames(
        NATIVE_CHIP_BASE_CLASS,
        NATIVE_CHIP_VARIANT_CLASS[resolvedVariant][resolvedColor],
        paddingClass,
        gapClass,
        radiusClass,
        isDisabled && NATIVE_CHIP_DISABLED_CLASS,
        className,
      )}
      style={style}
      {...rest}>
      {dot ? (
        <View
          className={classNames(
            NATIVE_CHIP_DOT_SHAPE_CLASS,
            typeof dot === "string"
              ? undefined
              : NATIVE_CHIP_DOT_CLASS[resolvedColor],
          )}
          style={typeof dot === "string" ? { backgroundColor: dot } : undefined}
        />
      ) : null}

      {avatar ? (
        <View className={classNames(NATIVE_CHIP_AVATAR_CLASS, avatarSizeClass)}>
          {avatar}
        </View>
      ) : null}

      {startIcon && !avatar ? (
        <View className={classNames(NATIVE_CHIP_SLOT_CLASS, iconSizeClass)}>
          {startIcon}
        </View>
      ) : null}

      <Typography
        className={classNames(
          fontClass,
          NATIVE_CHIP_TEXT_CLASS[resolvedVariant][resolvedColor],
        )}>
        {children}
      </Typography>

      {endIcon && !onClose ? (
        <View className={classNames(NATIVE_CHIP_SLOT_CLASS, iconSizeClass)}>
          {endIcon}
        </View>
      ) : null}

      {onClose ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          accessibilityState={{ disabled: isDisabled }}
          disabled={isDisabled}
          onPress={isDisabled ? undefined : onClose}
          // The remove control is its own target, so a press on it must not also press the
          // chip it sits in.
          hitSlop={6}
          className={classNames(NATIVE_CHIP_CLOSE_CLASS, iconSizeClass)}>
          {closeIcon ?? (
            <Typography className={fontClass}>
              {NATIVE_CHIP_CLOSE_GLYPH}
            </Typography>
          )}
        </Pressable>
      ) : null}
    </Pressable>
  );
}
