/**
 * Radio component for the native package.
 *
 * The component satisfies the framework's radio contract: the same value, label,
 * description, checked state and disabled option as the web radio, and the same
 * vocabulary for its visual tokens. Four things are deliberately native rather than
 * portable:
 *
 * 1. The state is announced through `accessibilityRole="radio"` and
 *    `accessibilityState`, which is where the platform reads a radio's name and whether
 *    it is picked, instead of the web's `role` and `aria-checked`.
 * 2. The dot is drawn rather than being a platform control, because a native control
 *    takes a colour *value* and the framework's contract names a colour *role*: a
 *    control that cannot resolve a role would take the option and ignore it. The dot
 *    appears with the platform's own animator, which is the mechanism that runs here.
 * 3. There is no change event. Picking is what a radio reports, so the handler takes the
 *    state and the value, and the platform's event object stays with the platform.
 * 4. The label and the description are strings. A native label is text, where the web
 *    label may be a node.
 */

import {
  type Color,
  type FieldStatus,
  NATIVE_RADIO_CARD_CLASS,
  NATIVE_RADIO_COLOR_CLASS,
  NATIVE_RADIO_DISABLED_CLASS,
  NATIVE_RADIO_FONT_CLASS,
  NATIVE_RADIO_GAP_CLASS,
  NATIVE_RADIO_INNER_SIZE_CLASS,
  NATIVE_RADIO_OUTER_BASE_CLASS,
  NATIVE_RADIO_OUTER_SIZE_CLASS,
  NATIVE_RADIO_ROW_CLASS,
  NATIVE_RADIO_STATUS_BORDER_CLASS,
  NATIVE_RADIUS_CLASS,
  type RadioVariant,
  type Radius,
  resolveCascade,
  resolveClassKey,
  type Size,
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
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_RADIO_CONFIG,
  type NativeRadioConfig,
} from "./radio-config";
import { useRadioGroupContext } from "./radio-context";

/**
 * How long the dot takes to appear or to leave, in milliseconds.
 * The pace is the component's own rather than the contract's.
 */
const RADIO_DOT_DURATION_MS = 150;

/** The rounding a radio drawn as a card takes, which is one step above the family's. */
const RADIO_CARD_RADIUS: Radius = "xl";

/**
 * Props for the native Radio.
 */
export interface RadioProps
  extends NativeRadioConfig,
    Omit<PressableProps, "children" | "style" | "onPress" | "disabled"> {
  /** The value this radio stands for inside its group. */
  value: string;

  /** The option's label, which is also its accessible name. */
  label?: string;

  /** The explanation under the label, and the option's hint. */
  description?: string;

  /**
   * Whether this radio is picked, for a consumer that owns the selection.
   * Inside a group the group owns it, and this is ignored.
   */
  checked?: boolean;

  /** Whether this radio starts picked, for one that stands alone. Defaults to false. */
  defaultChecked?: boolean;

  /** Called with the state and the value when the radio is picked. */
  onChange?: (checked: boolean, value: string) => void;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * One option in a set a reader picks from.
 *
 * The radio resolves its density, rounding, accent, treatment and validation status
 * through the standard AsheeUI cascade, and inside a `RadioGroup` it reads the selection,
 * the shared options and the disabled state from the group rather than restating them.
 *
 * @param props - The radio's options and the platform's pressable props.
 * @param props.value - The value this radio stands for.
 * @param props.label - The option's label.
 * @param props.description - The explanation under the label.
 * @param props.checked - Whether it is picked, for a radio that stands alone.
 * @param props.onChange - Called with the state and the value when it is picked.
 * @returns The rendered option.
 *
 * @example
 * ```tsx
 * <RadioGroup label="Plan" value={plan} onChange={setPlan}>
 *   <Radio value="starter" label="Starter" />
 *   <Radio value="growth" label="Growth" description="Everything in Starter" />
 * </RadioGroup>
 * ```
 *
 * @see RadioGroup - The control that owns the selection.
 * @see Switch - The other control that holds a choice a consumer makes.
 */
export function Radio({
  value,
  label,
  description,
  checked,
  defaultChecked = false,
  onChange,
  isDisabled,
  size,
  radius,
  variant,
  color,
  status,
  className,
  style,
  ...rest
}: RadioProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.radio;
  const group = useRadioGroupContext();
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);

  const resolvedSize = resolveCascade<Size>(
    size ?? group?.size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_RADIO_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_RADIO_CONFIG.radius,
  );
  const resolvedVariant = resolveCascade<RadioVariant>(
    variant ?? group?.variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_RADIO_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<Color>(
    color ?? group?.color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_RADIO_CONFIG.color,
  );
  const resolvedStatus = resolveCascade<FieldStatus>(
    status ?? group?.status,
    sectionConfig?.status,
    undefined,
    FALLBACK_NATIVE_RADIO_CONFIG.status,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled ?? group?.isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_RADIO_CONFIG.isDisabled,
  );

  // A group owns the selection; a radio that stands alone holds its own.
  const isChecked = group
    ? group.value === value
    : (checked ?? uncontrolledChecked);
  const isCard = resolvedVariant === "card";

  const colorClasses = NATIVE_RADIO_COLOR_CLASS[resolvedColor];
  const statusBorder = NATIVE_RADIO_STATUS_BORDER_CLASS[resolvedStatus];
  const radiusClass = resolveClassKey(
    resolvedRadius,
    NATIVE_RADIUS_CLASS,
    FALLBACK_NATIVE_RADIO_CONFIG.radius,
  );
  const cardRadiusClass = resolveClassKey(
    RADIO_CARD_RADIUS,
    NATIVE_RADIUS_CLASS,
    RADIO_CARD_RADIUS,
  );

  // The dot's presence is a value rather than state: appearing does not re-render the
  // option, and the platform's animator is the mechanism that runs here.
  const scale = useRef(new Animated.Value(isChecked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: isChecked ? 1 : 0,
      duration: RADIO_DOT_DURATION_MS,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isChecked, scale]);

  return (
    <Pressable
      {...rest}
      accessibilityRole="radio"
      accessibilityLabel={label ?? value}
      accessibilityHint={description}
      accessibilityState={{ checked: isChecked, disabled: resolvedDisabled }}
      disabled={resolvedDisabled}
      onPress={() => {
        if (resolvedDisabled) return;
        if (group) {
          group.onChange?.(value);
        } else if (checked === undefined) {
          setUncontrolledChecked(true);
        }
        onChange?.(true, value);
      }}
      className={classNames(
        NATIVE_RADIO_ROW_CLASS,
        NATIVE_RADIO_GAP_CLASS[resolvedSize],
        isCard && NATIVE_RADIO_CARD_CLASS,
        isCard && cardRadiusClass,
        isCard &&
          (isChecked
            ? classNames(colorClasses.border, colorClasses.cardBg)
            : statusBorder),
        resolvedDisabled && NATIVE_RADIO_DISABLED_CLASS,
        className,
      )}
      style={style}>
      <View
        className={classNames(
          NATIVE_RADIO_OUTER_BASE_CLASS,
          NATIVE_RADIO_OUTER_SIZE_CLASS[resolvedSize],
          radiusClass,
          isChecked ? colorClasses.border : statusBorder,
        )}>
        <Animated.View
          className={classNames(
            NATIVE_RADIO_INNER_SIZE_CLASS[resolvedSize],
            radiusClass,
            colorClasses.bg,
          )}
          style={{ transform: [{ scale }] }}
        />
      </View>
      {(label || description) && (
        <View className="flex-col min-w-0">
          {label && (
            <Text
              role="label"
              className={NATIVE_RADIO_FONT_CLASS[resolvedSize]}>
              {label}
            </Text>
          )}
          {description && (
            <Text
              role="body-sm"
              tone="muted"
              className={NATIVE_RADIO_FONT_CLASS[resolvedSize]}>
              {description}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}
