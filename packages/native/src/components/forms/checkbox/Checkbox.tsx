/**
 * Checkbox component for the native package.
 *
 * The component satisfies the framework's checkbox contract: the same value,
 * label, description, checked state and disabled option as the web checkbox, and
 * the same vocabulary for its visual tokens. Three things are deliberately
 * native rather than portable:
 *
 * 1. The state is announced through `accessibilityRole="checkbox"` and
 *    `accessibilityState`, which is where the platform reads a checkbox's name
 *    and whether it is ticked, instead of the web's `type="checkbox"` and
 *    `checked`.
 * 2. The square and its glyph are drawn rather than being a platform control,
 *    because a native control takes a colour *value* and the framework's
 *    contract names a colour *role*: a control that cannot resolve a role would
 *    take the option and ignore it.
 * 3. There is no change event. Pressing is what a checkbox reports, so the
 *    handler takes the state and the value, and the platform's event object
 *    stays with the platform.
 */

import {
  type Color,
  type FieldStatus,
  type Radius,
  resolveCascade,
  resolveClassKey,
  resolvePress,
  type Size,
} from "@asheeui/core";
import { useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, type PressableProps, View } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import {
  NATIVE_CHECKBOX_COLOR_CLASS,
  NATIVE_CHECKBOX_DISABLED_CLASS,
  NATIVE_CHECKBOX_FONT_CLASS,
  NATIVE_CHECKBOX_GAP_CLASS,
  NATIVE_CHECKBOX_GLYPH_SIZE_CLASS,
  NATIVE_CHECKBOX_OUTER_BASE_CLASS,
  NATIVE_CHECKBOX_OUTER_SIZE_CLASS,
  NATIVE_CHECKBOX_ROW_CLASS,
  NATIVE_CHECKBOX_STATUS_BORDER_CLASS,
} from "../../../styles/checkbox";
import { NATIVE_RADIUS_CLASS } from "../../../styles/radius";
import { cn } from "../../../utils/cn";
import { Typography } from "../../typography/text/Text";
import {
  FALLBACK_NATIVE_CHECKBOX_CONFIG,
  type NativeCheckboxConfig,
} from "./checkbox-config";
import { useCheckboxGroupContext } from "./checkbox-context";

/**
 * Props for the native Checkbox.
 */
export interface CheckboxProps
  extends NativeCheckboxConfig,
    Omit<PressableProps, "children" | "style" | "onPress" | "disabled"> {
  /** The value this checkbox stands for inside its group. */
  value: string;

  /** The option's label, which is also its accessible name. */
  label?: string;

  /** The explanation under the label, and the option's hint. */
  description?: string;

  /**
   * Whether this checkbox is checked, for a consumer that owns the state.
   * Inside a group the group owns it, and this is ignored.
   */
  checked?: boolean;

  /** Whether this checkbox starts checked, for one that stands alone. Defaults to false. */
  defaultChecked?: boolean;

  /** Called with the state and the value when the checkbox is pressed. */
  onChange?: (checked: boolean, value: string) => void;

  /**
   * Called when the option is pressed, under the name the web package uses.
   *
   * The checkbox's own press is what toggles it, so this is the press rather
   * than the change: it runs before `onChange` and says nothing about the next
   * state. `onPress` was already excluded from the props because the platform's
   * choice owns that act.
   */
  onClick?: PressableProps["onClick"];

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A square a reader ticks, with an optional label and description.
 *
 * The checkbox resolves its density, rounding, accent and validation status
 * through the standard AsheeUI cascade, and inside a `CheckboxGroup` it reads the
 * selected values, the shared options and the disabled state from the group
 * rather than restating them.
 *
 * @param props - The checkbox's options and the platform's pressable props.
 * @param props.value - The value this checkbox stands for.
 * @param props.label - The option's label.
 * @param props.description - The explanation under the label.
 * @param props.checked - Whether it is checked, for one that stands alone.
 * @param props.onChange - Called with the state and the value when it is pressed.
 * @returns The rendered option.
 *
 * @example
 * ```tsx
 * <CheckboxGroup label="Interests" defaultValue={["news"]}>
 *   <Checkbox value="news" label="News" />
 *   <Checkbox value="sport" label="Sport" description="Results and fixtures" />
 * </CheckboxGroup>
 * ```
 *
 * @see CheckboxGroup - The control that owns the selected values.
 * @see Switch - The other control that holds a boolean a consumer sets.
 */
export function Checkbox({
  value,
  label,
  description,
  checked,
  defaultChecked = false,
  onChange,
  onClick,
  isDisabled,
  size,
  radius,
  color,
  status,
  className,
  style,
  ...rest
}: CheckboxProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components.checkbox;
  const group = useCheckboxGroupContext();
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);

  const resolvedSize = resolveCascade<Size>(
    size ?? group?.size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_CHECKBOX_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_CHECKBOX_CONFIG.radius,
  );
  const resolvedColor = resolveCascade<Color>(
    color ?? group?.color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_CHECKBOX_CONFIG.color,
  );
  const resolvedStatus = resolveCascade<FieldStatus>(
    status ?? group?.status,
    sectionConfig?.status,
    undefined,
    FALLBACK_NATIVE_CHECKBOX_CONFIG.status,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled ?? group?.isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_CHECKBOX_CONFIG.isDisabled,
  );

  // A group owns the selection; a checkbox that stands alone holds its own.
  const isChecked = group
    ? group.value.includes(value)
    : (checked ?? uncontrolledChecked);

  const colorClasses = NATIVE_CHECKBOX_COLOR_CLASS[resolvedColor];
  const statusBorder = NATIVE_CHECKBOX_STATUS_BORDER_CLASS[resolvedStatus];
  const radiusClass = resolveClassKey(
    resolvedRadius,
    NATIVE_RADIUS_CLASS,
    FALLBACK_NATIVE_CHECKBOX_CONFIG.radius,
  );

  return (
    <Pressable
      {...rest}
      accessibilityRole="checkbox"
      accessibilityLabel={label ?? value}
      accessibilityHint={description}
      accessibilityState={{ checked: isChecked, disabled: resolvedDisabled }}
      disabled={resolvedDisabled}
      onPress={(pressEvent) => {
        if (resolvedDisabled) return;

        const nextChecked = !isChecked;

        // The press is the act and the change is its result, so the press is
        // reported first; a consumer that passed both names sees the order the
        // web checkbox has.
        resolvePress({ onClick }, pressEvent);

        if (group) {
          const nextValues = nextChecked
            ? [...group.value, value]
            : group.value.filter((selected) => selected !== value);
          group.onChange?.(nextValues);
        } else if (checked === undefined) {
          setUncontrolledChecked(nextChecked);
        }

        onChange?.(nextChecked, value);
      }}
      className={cn(
        NATIVE_CHECKBOX_ROW_CLASS,
        NATIVE_CHECKBOX_GAP_CLASS[resolvedSize],
        resolvedDisabled && NATIVE_CHECKBOX_DISABLED_CLASS,
        className,
      )}
      style={style}>
      <View
        className={cn(
          NATIVE_CHECKBOX_OUTER_BASE_CLASS,
          NATIVE_CHECKBOX_OUTER_SIZE_CLASS[resolvedSize],
          radiusClass,
          isChecked
            ? cn(colorClasses.border, colorClasses.bg)
            : cn("bg-background", statusBorder),
        )}>
        {isChecked && (
          <Typography
            role="label"
            className={cn(
              NATIVE_CHECKBOX_GLYPH_SIZE_CLASS[resolvedSize],
              colorClasses.check,
              "font-bold leading-none",
            )}>
            ✓
          </Typography>
        )}
      </View>
      {(label || description) && (
        <View className="flex-col min-w-0">
          {label && (
            <Typography
              role="label"
              className={NATIVE_CHECKBOX_FONT_CLASS[resolvedSize]}>
              {label}
            </Typography>
          )}
          {description && (
            <Typography
              role="body-sm"
              tone="muted"
              className={NATIVE_CHECKBOX_FONT_CLASS[resolvedSize]}>
              {description}
            </Typography>
          )}
        </View>
      )}
    </Pressable>
  );
}
