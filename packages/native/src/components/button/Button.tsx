/**
 * Button component for the native package.
 *
 * The component satisfies the framework's button contract: the same prop names, the
 * same options and the same meaning as the web button, implemented the way the
 * platform behaves. It is a `Pressable`, so it gains the platform's own press
 * feedback and its own accessibility semantics, and it reports its state through
 * `accessibilityState` so a screen reader announces a disabled or busy control rather
 * than finding an ordinary one.
 */

import {
  type ColorRole,
  type Radius,
  resolveCascade,
  type Size,
  type Variant,
} from "@asheeui/shared";
import type { ReactNode } from "react";
import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import {
  FALLBACK_NATIVE_BUTTON_CONFIG,
  type NativeButtonConfig,
} from "./button-config";
import {
  BUTTON_BASE_CLASS,
  BUTTON_DISABLED_CLASS,
  BUTTON_FULL_WIDTH_CLASS,
  BUTTON_RADIUS_CLASS,
  BUTTON_SIZE_CLASS,
  BUTTON_TEXT_CLASS,
  BUTTON_VARIANT_CLASS,
} from "./button-styles";

/**
 * Props for the native Button.
 */
export interface ButtonProps
  extends NativeButtonConfig,
    Omit<PressableProps, "children" | "disabled" | "style"> {
  /** The button's visible label, and its accessible name. */
  children?: ReactNode;

  /** Whether the button is disabled. */
  isDisabled?: boolean;

  /** Whether the button shows a pending state and blocks interaction. */
  isLoading?: boolean;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A native button that resolves its appearance through the framework's cascade.
 *
 * The same prop names work here as on the web, and the platform differences are
 * defaults rather than props: the default density is larger, the press feedback is the
 * platform's, and a busy button is announced as busy. A consumer that wants the web's
 * smaller density asks for it with `size`, which is a contract both platforms share.
 *
 * @param props - The button's options and the platform's press props.
 * @param props.children - The label.
 * @param props.variant - Visual treatment. Defaults to the platform's `defaultVariant`.
 * @param props.color - Colour role. Defaults to the platform's `defaultColor`.
 * @param props.size - Density. Defaults to `"lg"`.
 * @param props.radius - Corner rounding. Defaults to the platform's `defaultRadius`.
 * @param props.fullWidth - Stretch to the container's width. Defaults to false.
 * @param props.isDisabled - Disable the control. Defaults to false.
 * @param props.isLoading - Show a pending state. Defaults to false.
 * @returns The rendered button.
 *
 * @example
 * ```tsx
 * <Button variant="solid" fullWidth onPress={save}>
 *   Save invoice
 * </Button>
 * ```
 *
 * @see Text - The typography component the label resolves through.
 */
export function Button({
  children,
  variant,
  color,
  size,
  radius,
  fullWidth,
  isDisabled,
  isLoading,
  className,
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.button;

  // Every option resolves through the same four tiers: the instance prop, the
  // component's configuration (which already carries the registered defaults), the
  // platform default, and finally the value this component documents. Looking at one
  // option makes the rule for all of them visible.
  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    config.defaultVariant,
    FALLBACK_NATIVE_BUTTON_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<ColorRole>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_BUTTON_CONFIG.color,
  );
  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_BUTTON_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_BUTTON_CONFIG.radius,
  );
  const resolvedFullWidth = resolveCascade<boolean>(
    fullWidth,
    sectionConfig?.fullWidth,
    undefined,
    FALLBACK_NATIVE_BUTTON_CONFIG.fullWidth,
  );

  // A busy button is also disabled: pressing it twice would send the action twice.
  const isInteractionDisabled = Boolean(isDisabled) || Boolean(isLoading);

  const classes = classNames(
    BUTTON_BASE_CLASS,
    BUTTON_SIZE_CLASS[resolvedSize],
    BUTTON_RADIUS_CLASS[resolvedRadius],
    BUTTON_VARIANT_CLASS[resolvedVariant][resolvedColor],
    BUTTON_TEXT_CLASS[resolvedVariant][resolvedColor],
    resolvedFullWidth && BUTTON_FULL_WIDTH_CLASS,
    isInteractionDisabled && BUTTON_DISABLED_CLASS,
    className,
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: isInteractionDisabled,
        busy: Boolean(isLoading),
      }}
      disabled={isInteractionDisabled}
      onPress={isInteractionDisabled ? undefined : onPress}
      className={classes}
      style={style}
      {...rest}>
      {isLoading ? (
        // The spinner is decoration inside a control that already announces its busy
        // state. It is hidden from assistive technology on purpose, so a screen reader
        // hears "Save, busy" rather than "Loading, Save" and the button keeps one
        // stable name.
        <ActivityIndicator
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          size="small"
          testID="button-spinner"
        />
      ) : null}
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </Pressable>
  );
}
