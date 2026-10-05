/**
 * Calendar component for the native package.
 *
 * The component satisfies the framework's date-field contract: the same value, the same
 * change handler, the same modes, the same field vocabulary and the same written value as
 * the web date field, whose rules it reads from `@asheeui/core` rather than restating them.
 *
 * Three things are deliberately native rather than portable, and each is what the platform
 * offers rather than a preference:
 *
 * 1. The month is one surface at a time rather than a panel floated beside the field, for
 *    the reason the select states: the platform has no floating layer to place beside a
 *    control, so what a field opens is a surface the reader dismisses.
 * 2. The value is read rather than typed. The field shows the value and opens the month to
 *    change it, because a keyboard raised inside the surface covers the month the reader is
 *    choosing from. The web's typed date editing therefore has no counterpart here.
 * 3. The time is stepped rather than typed, for the same reason: the `HH`, `MM` and `SS`
 *    columns step one value at a time and apply each step as it is taken.
 *
 * The rules are untouched: `formatDisplay` writes the value and the shared helpers build the
 * month and decide which days may be reached, so a date read on the platform is the date the
 * web field shows.
 */

import {
  type CalendarMode,
  type Color,
  type FieldStatus,
  formatDisplay,
  getDefaultPlaceholder,
  isFieldInvalid,
  NATIVE_CALENDAR_TRIGGER_ACTIONS_CLASS,
  NATIVE_CALENDAR_TRIGGER_CLASS,
  NATIVE_CALENDAR_TRIGGER_CLEAR_CLASS,
  NATIVE_CALENDAR_TRIGGER_CLEAR_LABEL_CLASS,
  NATIVE_CALENDAR_TRIGGER_GLYPH_CLASS,
  NATIVE_INPUT_BASE_CLASS,
  NATIVE_INPUT_DISABLED_CLASS,
  NATIVE_INPUT_EDGE_ACCENT_CLASS,
  NATIVE_INPUT_EDGE_INVALID_CLASS,
  NATIVE_INPUT_EDGE_NEUTRAL_CLASS,
  NATIVE_INPUT_EDGE_WIDTH_CLASS,
  NATIVE_INPUT_SIZE_CLASS,
  NATIVE_INPUT_VARIANT_CLASS,
  NATIVE_RADIUS_CLASS,
  type Radius,
  resolveCascade,
  type Size,
  type Variant,
} from "@asheeui/core";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { FieldShell } from "../field/FieldShell";
import { Text } from "../text/Text";
import { CalendarSheet } from "./CalendarSheet";
import {
  FALLBACK_NATIVE_CALENDAR_CONFIG,
  type NativeCalendarConfig,
} from "./calendar-config";

/** The glyph that says the field collects a time rather than a day. */
const TIME_GLYPH = "◷";

/** The glyph that says the field collects a day. */
const DATE_GLYPH = "▦";

/**
 * Props for the native Calendar.
 */
export interface CalendarProps extends NativeCalendarConfig {
  /** The chosen date, for a consumer that owns it. */
  value?: Date | null;

  /** The date chosen at first, for a consumer that does not. */
  defaultValue?: Date | null;

  /** Called with the value the reader chose, or with null when it is emptied. */
  onChange?: (date: Date | null) => void;

  /** Whether the field offers a control that empties it. Defaults to false. */
  isClearable?: boolean;

  /** Whether days after today are refused. Defaults to false. */
  disableFuture?: boolean;

  /** What the field says while it holds nothing. */
  placeholder?: string;

  /** The field's label, which also names the control. */
  label?: string;

  /** Description shown under the label. */
  description?: string;

  /** Validation message shown under the field. */
  message?: string;

  /** Whether the field is waiting for something, which shows a pending marker. */
  isLoading?: boolean;

  /** The heading of the surface the value is chosen on. */
  sheetTitle?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Identifier for the trigger, so a test can reach it. */
  testID?: string;

  /** Identifier prefix for the surface's controls, so a test can reach one. */
  sheetTestID?: string;
}

/**
 * A field that collects a date, a time, or both.
 *
 * @param props - The field's value and what it collects.
 * @returns The rendered field.
 *
 * @see FieldShell - The label block every field in the family presents its field with.
 * @see CalendarSheet - The surface the value is chosen on.
 * @see Dropmenu - The field that picks one option from the same surface.
 */
export function Calendar({
  size,
  radius,
  variant,
  color,
  status,
  mode,
  isDisabled,
  required,
  value,
  defaultValue = null,
  onChange,
  isClearable = false,
  disableFuture = false,
  placeholder,
  label,
  description,
  message,
  isLoading,
  sheetTitle,
  className,
  testID,
  sheetTestID,
}: CalendarProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.calendar;
  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(
    defaultValue,
  );

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_CALENDAR_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_CALENDAR_CONFIG.radius,
  );
  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_CALENDAR_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<Color>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_CALENDAR_CONFIG.color,
  );
  const resolvedStatus = resolveCascade<FieldStatus>(
    status,
    sectionConfig?.status,
    undefined,
    FALLBACK_NATIVE_CALENDAR_CONFIG.status,
  );
  const resolvedMode = resolveCascade<CalendarMode>(
    mode,
    sectionConfig?.mode,
    undefined,
    FALLBACK_NATIVE_CALENDAR_CONFIG.mode,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_CALENDAR_CONFIG.isDisabled,
  );
  const resolvedRequired = resolveCascade<boolean>(
    required,
    sectionConfig?.required,
    undefined,
    FALLBACK_NATIVE_CALENDAR_CONFIG.required,
  );

  // A field holds its own value until a consumer takes the value over, which is the
  // contract every member of the family shares.
  const isControlled = value !== undefined;
  const chosen = isControlled ? (value ?? null) : uncontrolledValue;

  const commit = (next: Date | null) => {
    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next);
  };

  const isInvalid = isFieldInvalid(resolvedStatus);
  const edgeClass = classNames(
    NATIVE_INPUT_EDGE_WIDTH_CLASS[resolvedVariant],
    isInvalid
      ? NATIVE_INPUT_EDGE_INVALID_CLASS
      : isOpen
        ? NATIVE_INPUT_EDGE_ACCENT_CLASS[resolvedColor]
        : NATIVE_INPUT_EDGE_NEUTRAL_CLASS[resolvedVariant],
  );

  const shown = chosen
    ? formatDisplay(chosen, resolvedMode)
    : (placeholder ?? getDefaultPlaceholder(resolvedMode));

  return (
    <FieldShell
      label={label}
      description={description}
      message={message}
      status={resolvedStatus}
      required={resolvedRequired}
      isLoading={isLoading}>
      <Pressable
        testID={testID}
        accessibilityRole="combobox"
        accessibilityLabel={label ?? placeholder}
        accessibilityHint={description}
        aria-invalid={isInvalid}
        accessibilityState={{
          expanded: isOpen,
          disabled: resolvedDisabled,
        }}
        disabled={resolvedDisabled}
        onPress={() => setIsOpen(true)}
        className={classNames(
          NATIVE_INPUT_BASE_CLASS,
          NATIVE_INPUT_SIZE_CLASS[resolvedSize],
          NATIVE_RADIUS_CLASS[resolvedRadius],
          NATIVE_INPUT_VARIANT_CLASS[resolvedVariant],
          NATIVE_CALENDAR_TRIGGER_CLASS,
          edgeClass,
          resolvedDisabled && NATIVE_INPUT_DISABLED_CLASS,
          className,
        )}>
        <Text role="body-md">{shown}</Text>
        <View className={NATIVE_CALENDAR_TRIGGER_ACTIONS_CLASS}>
          {isClearable && chosen && !resolvedDisabled && (
            <Pressable
              testID={testID ? `${testID}-clear` : undefined}
              accessibilityRole="button"
              accessibilityLabel="Clear selection"
              onPress={() => commit(null)}
              className={NATIVE_CALENDAR_TRIGGER_CLEAR_CLASS}>
              <Text
                role="body-sm"
                accessible={false}
                className={NATIVE_CALENDAR_TRIGGER_CLEAR_LABEL_CLASS}>
                ✕
              </Text>
            </Pressable>
          )}
          {/* The glyph is decoration: the control's role and its label already say what
              the field is, and a reader who cannot see the glyph loses nothing. */}
          <Text
            role="body-md"
            accessible={false}
            className={NATIVE_CALENDAR_TRIGGER_GLYPH_CLASS}>
            {resolvedMode === "time" ? TIME_GLYPH : DATE_GLYPH}
          </Text>
        </View>
      </Pressable>
      <CalendarSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        value={chosen}
        mode={resolvedMode}
        size={resolvedSize}
        color={resolvedColor}
        isClearable={isClearable}
        disableFuture={disableFuture}
        onSelect={commit}
        title={sheetTitle ?? label}
        testID={sheetTestID ?? testID}
      />
    </FieldShell>
  );
}
