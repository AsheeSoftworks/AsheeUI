/**
 * Switch component for the native package.
 *
 * The component satisfies the framework's switch contract: the same label,
 * description, checked state, required marker and disabled option as the web switch,
 * and the same vocabulary for its visual tokens. Three things are deliberately native
 * rather than portable:
 *
 * 1. The state is announced through `accessibilityRole="switch"` and
 *    `accessibilityState`, which is where the platform reads a switch's name and
 *    whether it is on, instead of the web's `role` and `aria-checked`.
 * 2. The knob travels with the platform's animator, because NativeWind cannot run a
 *    transition class here; an `Animated` value is a value rather than state, so
 *    moving costs no re-renders.
 * 3. There is no change event. Pressing is what a switch reports, so the handler takes
 *    the next state alone and the platform's event object stays with the platform.
 */

import {
  type ColorRole,
  NATIVE_RADIUS_CLASS,
  NATIVE_SWITCH_CHECKED_CLASS,
  NATIVE_SWITCH_DISABLED_CLASS,
  NATIVE_SWITCH_THUMB_CLASS,
  NATIVE_SWITCH_THUMB_SIZE_CLASS,
  NATIVE_SWITCH_THUMB_TRAVEL,
  NATIVE_SWITCH_TRACK_CLASS,
  NATIVE_SWITCH_TRACK_SIZE_CLASS,
  NATIVE_SWITCH_UNCHECKED_CLASS,
  type Radius,
  resolveCascade,
  resolveClassKey,
  type Size,
  type Variant,
} from "@asheeui/core";
import { useEffect, useRef, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import {
  Animated,
  Easing,
  Pressable,
  type PressableProps,
  View,
} from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import {
  FALLBACK_NATIVE_SWITCH_CONFIG,
  type NativeSwitchConfig,
} from "./switch-config";

/**
 * How long the knob takes to travel, in milliseconds.
 *
 * The pace is the component's own rather than the contract's: what a consumer chooses
 * is whether the switch is on, not how quickly the platform says so.
 */
const SWITCH_TRAVEL_DURATION_MS = 200;

/**
 * Props for the native Switch.
 */
export interface SwitchProps
  extends NativeSwitchConfig,
    Omit<PressableProps, "children" | "style" | "onPress"> {
  /** The switch's label, which also names the control. */
  label?: string;

  /** The explanation under the label, and the control's hint. */
  description?: string;

  /** The state, for a consumer that owns it. */
  checked?: boolean;

  /** The initial state, for a consumer that does not. Defaults to false. */
  defaultChecked?: boolean;

  /** Called with the next state whenever the switch is toggled. */
  onChange?: (checked: boolean) => void;

  /**
   * Whether the switch is waiting for something.
   *
   * A pending switch shows the framework's spinner beside its label and refuses to
   * move, because a switch that reports a state while the state is being saved would
   * report something the consumer has not accepted yet.
   *
   * @default false
   */
  isLoading?: boolean;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A control that holds one boolean.
 *
 * The state is controlled by `checked` or kept by the switch itself through
 * `defaultChecked`, whichever the consumer asked for, and it resolves its density,
 * rounding, accent and treatment through the standard AsheeUI cascade.
 *
 * @param props - The switch's options and the platform's pressable props.
 * @param props.label - The switch's label.
 * @param props.description - The explanation under the label.
 * @param props.checked - The state, for a controlled switch.
 * @param props.defaultChecked - The initial state, for an uncontrolled one.
 * @param props.onChange - Called with the next state.
 * @param props.isDisabled - Make the control unavailable. Defaults to the configured value.
 * @param props.isLoading - Show a pending state and block interaction.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <Switch
 *   label="Weekly digest"
 *   description="A summary every Monday"
 *   defaultChecked
 *   onChange={setDigest}
 * />
 * ```
 *
 * @see FieldShell - The label, description and message block the field shows.
 * @see Radio - The other control that holds a choice a consumer makes.
 */
export function Switch({
  label,
  description,
  checked,
  defaultChecked = false,
  onChange,
  isDisabled,
  isLoading,
  required,
  size,
  radius,
  variant,
  color,
  className,
  style,
  ...rest
}: SwitchProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.switch;
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : uncontrolledChecked;

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_SWITCH_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_SWITCH_CONFIG.radius,
  );
  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_SWITCH_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<ColorRole>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_SWITCH_CONFIG.color,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_SWITCH_CONFIG.isDisabled,
  );
  const resolvedRequired = resolveCascade<boolean>(
    required,
    sectionConfig?.required,
    undefined,
    FALLBACK_NATIVE_SWITCH_CONFIG.required,
  );

  const travel = NATIVE_SWITCH_THUMB_TRAVEL[resolvedSize];
  const isUnavailable = resolvedDisabled || Boolean(isLoading);

  // The knob's position is a value rather than state: travelling does not re-render
  // the field, and the distance is read from the resolved density rather than per
  // frame.
  const offset = useRef(new Animated.Value(isChecked ? travel : 0)).current;

  useEffect(() => {
    Animated.timing(offset, {
      toValue: isChecked ? travel : 0,
      duration: SWITCH_TRAVEL_DURATION_MS,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isChecked, travel, offset]);

  const radiusClass = resolveClassKey(
    resolvedRadius,
    NATIVE_RADIUS_CLASS,
    FALLBACK_NATIVE_SWITCH_CONFIG.radius,
  );

  return (
    <FieldShell
      label={label}
      description={description}
      required={resolvedRequired}
      isLoading={isLoading}>
      <Pressable
        {...rest}
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityHint={description}
        accessibilityState={{
          checked: isChecked,
          disabled: isUnavailable,
          busy: Boolean(isLoading),
        }}
        disabled={isUnavailable}
        onPress={() => {
          if (isUnavailable) return;
          if (!isControlled) setUncontrolledChecked(!isChecked);
          onChange?.(!isChecked);
        }}
        className={classNames(
          "self-start",
          isUnavailable && NATIVE_SWITCH_DISABLED_CLASS,
          className,
        )}>
        <View
          className={classNames(
            NATIVE_SWITCH_TRACK_CLASS,
            NATIVE_SWITCH_TRACK_SIZE_CLASS[resolvedSize],
            radiusClass,
            isChecked
              ? NATIVE_SWITCH_CHECKED_CLASS[resolvedColor]
              : NATIVE_SWITCH_UNCHECKED_CLASS,
            resolvedVariant === "ghost" && "bg-transparent",
          )}
          style={style}>
          <Animated.View
            className={classNames(
              NATIVE_SWITCH_THUMB_CLASS,
              NATIVE_SWITCH_THUMB_SIZE_CLASS[resolvedSize],
              radiusClass,
            )}
            style={{ transform: [{ translateX: offset }] }}
          />
        </View>
      </Pressable>
    </FieldShell>
  );
}
