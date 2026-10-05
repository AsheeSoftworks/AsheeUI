/**
 * One column of a time, for the native calendar.
 *
 * The web's time spinner has a field in the middle, because a pointer can type into one and
 * a keyboard never covers a desk. The platform's reader is holding the device, and a
 * keyboard raised inside a modal covers the surface they are choosing a time on, so the
 * column steps instead: one control forward, the number, one control back. What the two
 * share is everything a reader would notice — the same `HH`, `MM` and `SS` columns, the
 * same wrapping from the last value back to zero, the same value applied the moment it
 * changes — so the time a reader sets is the time either platform keeps.
 */

import {
  NATIVE_CALENDAR_STEP_CLASS,
  NATIVE_CALENDAR_STEP_LABEL_CLASS,
  NATIVE_CALENDAR_TIME_COLUMN_CLASS,
  NATIVE_CALENDAR_TIME_LABEL_CLASS,
  NATIVE_CALENDAR_TIME_VALUE_CLASS,
  NATIVE_CALENDAR_TIME_VALUE_TEXT_CLASS,
  pad2,
} from "@asheeui/core";
import { Pressable, View } from "react-native";
import { Text } from "../text/Text";

/**
 * Props for the internal time column.
 */
export interface TimeColumnProps {
  /** The column's name, such as `HH`. It is also how the controls announce themselves. */
  label: string;

  /** The value the column holds. */
  value: number;

  /** The largest value the column takes, which it wraps back from. */
  max: number;

  /** Called with the value the reader stepped to. */
  onChange: (value: number) => void;

  /** Identifier prefix for the controls, so a test can reach one. */
  testID?: string;
}

/**
 * A column of a time, with a control either side of its value.
 *
 * @param props - The column's name, value and bounds.
 * @returns The rendered column.
 *
 * @see CalendarSheet - The surface the columns sit on.
 */
export function TimeColumn({
  label,
  value,
  max,
  onChange,
  testID,
}: TimeColumnProps) {
  return (
    <View className={NATIVE_CALENDAR_TIME_COLUMN_CLASS}>
      <Text role="overline" className={NATIVE_CALENDAR_TIME_LABEL_CLASS}>
        {label}
      </Text>
      <Pressable
        testID={testID ? `${testID}-increment` : undefined}
        accessibilityRole="button"
        accessibilityLabel={`Increment ${label}`}
        onPress={() => onChange(value >= max ? 0 : value + 1)}
        className={NATIVE_CALENDAR_STEP_CLASS}>
        <Text
          role="body-md"
          className={NATIVE_CALENDAR_STEP_LABEL_CLASS}
          accessible={false}>
          ▴
        </Text>
      </Pressable>
      <View className={NATIVE_CALENDAR_TIME_VALUE_CLASS}>
        <Text
          role="body-md"
          accessibilityLabel={`${label} ${pad2(value)}`}
          className={NATIVE_CALENDAR_TIME_VALUE_TEXT_CLASS}>
          {pad2(value)}
        </Text>
      </View>
      <Pressable
        testID={testID ? `${testID}-decrement` : undefined}
        accessibilityRole="button"
        accessibilityLabel={`Decrement ${label}`}
        onPress={() => onChange(value <= 0 ? max : value - 1)}
        className={NATIVE_CALENDAR_STEP_CLASS}>
        <Text
          role="body-md"
          className={NATIVE_CALENDAR_STEP_LABEL_CLASS}
          accessible={false}>
          ▾
        </Text>
      </Pressable>
    </View>
  );
}
