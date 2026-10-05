/**
 * The month a date field opens, for the native calendar.
 *
 * The web renders this inside the panel it floats beside the input. Here it is one surface
 * at a time, so the month, the time columns and the controls that accept or empty the value
 * are one piece of content, kept together because they write to one value: stepping the hour
 * has to keep the chosen day, and choosing a day has to keep the time the reader has already
 * set.
 *
 * What the surface decides is what the shared helpers already answer — which cells a month
 * has, which day is today, and which days and months the field refuses — so the month a
 * reader sees on the platform is the month they see on the web. What it does not carry is
 * the web's keyboard navigation: a platform grid is stepped through with a screen reader's
 * own gestures rather than with arrow keys, and the web's cursor arithmetic has no
 * counterpart here.
 *
 * The sheet owns the choice; the field owns the value. Every choice is reported through
 * `onSelect`, which is what keeps the value in one place.
 */

import {
  buildDayCells,
  type CalendarMode,
  type Color,
  canGoToNextMonth,
  combineDateAndTime,
  DAYS_OF_WEEK,
  type FieldSizeKey,
  isFutureDay,
  MONTHS,
  NATIVE_CALENDAR_CELL_CLASS,
  NATIVE_CALENDAR_CELL_DISABLED_CLASS,
  NATIVE_CALENDAR_CELL_SIZE_CLASS,
  NATIVE_CALENDAR_CELL_TEXT_CLASS,
  NATIVE_CALENDAR_CLEAR_CLASS,
  NATIVE_CALENDAR_CLEAR_LABEL_CLASS,
  NATIVE_CALENDAR_COLOR_CLASS,
  NATIVE_CALENDAR_DONE_CLASS,
  NATIVE_CALENDAR_DONE_LABEL_CLASS,
  NATIVE_CALENDAR_FOOTER_CLASS,
  NATIVE_CALENDAR_HEADER_CLASS,
  NATIVE_CALENDAR_MONTH_CLASS,
  NATIVE_CALENDAR_MONTH_GRID_CLASS,
  NATIVE_CALENDAR_NAV_CLASS,
  NATIVE_CALENDAR_NAV_LABEL_CLASS,
  NATIVE_CALENDAR_ROW_CLASS,
  NATIVE_CALENDAR_SHEET_CLASS,
  NATIVE_CALENDAR_TIME_ROW_CLASS,
  NATIVE_CALENDAR_UNAVAILABLE_CLASS,
  NATIVE_CALENDAR_WEEKDAY_CLASS,
  NATIVE_CALENDAR_WEEKDAYS_CLASS,
} from "@asheeui/core";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { classNames } from "../../utils/class-names";
import { Surface } from "../surface/Surface";
import { Text } from "../text/Text";
import { TimeColumn } from "./TimeColumn";

/**
 * Props for the internal calendar surface.
 */
export interface CalendarSheetProps {
  /** Whether the surface is showing. */
  isOpen: boolean;

  /** Called when the surface is dismissed, however it was dismissed. */
  onClose: () => void;

  /** The value the field holds, which the surface opens on. */
  value: Date | null;

  /** What the field collects, which decides what the surface shows. */
  mode: CalendarMode;

  /** Density of the field, which sizes the days. */
  size: FieldSizeKey;

  /** The accent the surface is drawn with. */
  color: Color;

  /** Whether the surface offers a control that empties the value. */
  isClearable: boolean;

  /** Whether days after today are refused. */
  disableFuture: boolean;

  /** Called with the value the surface holds, or with null when it is emptied. */
  onSelect: (value: Date | null) => void;

  /** The surface's heading. */
  title?: string;

  /** Identifier prefix for the surface's controls, so a test can reach one. */
  testID?: string;
}

/**
 * Everything a date field opens: the month, the time and the controls that finish it.
 *
 * @param props - The value the surface opens on and what it collects.
 * @returns The rendered surface.
 *
 * @see Surface - The panel every field that opens something draws on.
 * @see TimeColumn - One column of the time the surface collects.
 * @see Calendar - The field that opens this surface.
 */
export function CalendarSheet({
  isOpen,
  onClose,
  value,
  mode,
  size,
  color,
  isClearable,
  disableFuture,
  onSelect,
  title,
  testID,
}: CalendarSheetProps) {
  const [viewYear, setViewYear] = useState(() =>
    (value ?? new Date()).getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(() =>
    (value ?? new Date()).getMonth(),
  );
  const [hours, setHours] = useState(() => (value ?? new Date()).getHours());
  const [minutes, setMinutes] = useState(() =>
    (value ?? new Date()).getMinutes(),
  );
  const [seconds, setSeconds] = useState(() =>
    (value ?? new Date()).getSeconds(),
  );

  // The surface opens on the value the field holds, and only then: while it is open, the
  // month the reader has moved to and the time they have set are what it shows, and a value
  // arriving back through `onChange` would otherwise pull them back to where they started on
  // every step they took.
  useEffect(() => {
    if (!isOpen) return;

    const opening = value ?? new Date();
    setViewYear(opening.getFullYear());
    setViewMonth(opening.getMonth());
    setHours(opening.getHours());
    setMinutes(opening.getMinutes());
    setSeconds(opening.getSeconds());
  }, [isOpen]);

  const today = new Date();

  const colorStyles =
    NATIVE_CALENDAR_COLOR_CLASS[color] ?? NATIVE_CALENDAR_COLOR_CLASS.primary;

  // The two rules about a cell are the shared ones: a day after today is refused when the
  // field refuses future dates, and the month after today's is refused with it, since every
  // day in it would be refused. Both platforms read the same answer.
  function isDisabled(day: number): boolean {
    if (!disableFuture) return false;
    return isFutureDay(viewYear, viewMonth, day, today);
  }

  function isSelected(day: number): boolean {
    return (
      !!value &&
      value.getFullYear() === viewYear &&
      value.getMonth() === viewMonth &&
      value.getDate() === day
    );
  }

  function isToday(day: number): boolean {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  }

  function applyTime(h: number, m: number, s: number): void {
    onSelect(combineDateAndTime(value ?? new Date(), h, m, s));
  }

  function handleHoursChange(h: number): void {
    setHours(h);
    applyTime(h, minutes, seconds);
  }

  function handleMinutesChange(m: number): void {
    setMinutes(m);
    applyTime(hours, m, seconds);
  }

  function handleSecondsChange(s: number): void {
    setSeconds(s);
    applyTime(hours, minutes, s);
  }

  function handleDayPress(day: number): void {
    onSelect(
      combineDateAndTime(
        new Date(viewYear, viewMonth, day),
        hours,
        minutes,
        seconds,
      ),
    );

    // A field that collects a day is answered the moment the day is picked; a field that
    // collects a time as well stays open, because the reader has not finished.
    if (mode === "date") onClose();
  }

  function prevMonth(): void {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
    } else setViewMonth((month) => month - 1);
  }

  function nextMonth(): void {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
    } else setViewMonth((month) => month + 1);
  }

  const canGoNext =
    !disableFuture || canGoToNextMonth(viewYear, viewMonth, today);

  const showCalendar = mode === "date" || mode === "datetime";
  const showTime = mode === "time" || mode === "datetime";
  const showFooter = mode !== "date" || (isClearable && !!value);

  // A month is laid out as whole weeks, which is what puts the days under the weekday they
  // belong to; the blanks a month opens and closes with are the slots the row still holds.
  const cells = buildDayCells(viewYear, viewMonth);
  const weeks: (number | null)[][] = [];

  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  const footer = showFooter ? (
    <View className={NATIVE_CALENDAR_FOOTER_CLASS}>
      {isClearable && value ? (
        <Pressable
          testID={testID ? `${testID}-clear` : undefined}
          accessibilityRole="button"
          accessibilityLabel="Clear selection"
          onPress={() => {
            onSelect(null);
            onClose();
          }}
          className={NATIVE_CALENDAR_CLEAR_CLASS}>
          <Text role="label" className={NATIVE_CALENDAR_CLEAR_LABEL_CLASS}>
            Clear
          </Text>
        </Pressable>
      ) : (
        // The accepting control is held to the right of whatever stands beside it, so an
        // empty left side keeps it where a reader expects to find it.
        <View />
      )}
      {mode !== "date" && (
        <Pressable
          testID={testID ? `${testID}-done` : undefined}
          accessibilityRole="button"
          accessibilityLabel="Done"
          onPress={onClose}
          className={classNames(NATIVE_CALENDAR_DONE_CLASS, colorStyles.bg)}>
          <Text
            role="label"
            className={classNames(
              NATIVE_CALENDAR_DONE_LABEL_CLASS,
              colorStyles.on,
            )}>
            Done
          </Text>
        </Pressable>
      )}
    </View>
  ) : undefined;

  return (
    <Surface isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <View className={NATIVE_CALENDAR_SHEET_CLASS}>
        {showCalendar && (
          <View className={NATIVE_CALENDAR_MONTH_GRID_CLASS}>
            <View className={NATIVE_CALENDAR_HEADER_CLASS}>
              <Pressable
                testID={testID ? `${testID}-previous` : undefined}
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                onPress={prevMonth}
                className={NATIVE_CALENDAR_NAV_CLASS}>
                <Text
                  role="body-lg"
                  className={NATIVE_CALENDAR_NAV_LABEL_CLASS}
                  accessible={false}>
                  ‹
                </Text>
              </Pressable>
              <Text role="body-md" className={NATIVE_CALENDAR_MONTH_CLASS}>
                {MONTHS[viewMonth]} {viewYear}
              </Text>
              <Pressable
                testID={testID ? `${testID}-next` : undefined}
                accessibilityRole="button"
                accessibilityLabel="Next month"
                accessibilityState={{ disabled: !canGoNext }}
                disabled={!canGoNext}
                onPress={nextMonth}
                className={classNames(
                  NATIVE_CALENDAR_NAV_CLASS,
                  !canGoNext && NATIVE_CALENDAR_UNAVAILABLE_CLASS,
                )}>
                <Text
                  role="body-lg"
                  className={NATIVE_CALENDAR_NAV_LABEL_CLASS}
                  accessible={false}>
                  ›
                </Text>
              </Pressable>
            </View>

            <View className={NATIVE_CALENDAR_WEEKDAYS_CLASS}>
              {DAYS_OF_WEEK.map((weekday) => (
                <Text
                  key={weekday}
                  role="overline"
                  accessible={false}
                  className={NATIVE_CALENDAR_WEEKDAY_CLASS}>
                  {weekday}
                </Text>
              ))}
            </View>

            {weeks.map((week, weekIndex) => (
              <View
                // A week is identified by the days it holds; a week that holds none is only
                // a position in the month.
                key={week.find((day) => day !== null) ?? `week-${weekIndex}`}
                className={NATIVE_CALENDAR_ROW_CLASS}>
                {week.map((day, dayIndex) =>
                  day === null ? (
                    <View
                      key={`empty-slot-${weekIndex}-${dayIndex}`}
                      className={NATIVE_CALENDAR_CELL_CLASS}
                    />
                  ) : (
                    <Pressable
                      key={`day-${day}`}
                      testID={testID ? `${testID}-day-${day}` : undefined}
                      accessibilityRole="button"
                      accessibilityLabel={`${day} ${MONTHS[viewMonth]} ${viewYear}`}
                      accessibilityState={{
                        selected: isSelected(day),
                        disabled: isDisabled(day),
                      }}
                      disabled={isDisabled(day)}
                      onPress={() => handleDayPress(day)}
                      className={classNames(
                        NATIVE_CALENDAR_CELL_CLASS,
                        NATIVE_CALENDAR_CELL_SIZE_CLASS[size],
                        isDisabled(day) && NATIVE_CALENDAR_CELL_DISABLED_CLASS,
                        isSelected(day) && colorStyles.bg,
                        isToday(day) && !isSelected(day) && colorStyles.border,
                      )}>
                      <Text
                        role="body-sm"
                        className={classNames(
                          NATIVE_CALENDAR_CELL_TEXT_CLASS,
                          isSelected(day) && colorStyles.on,
                          isToday(day) && !isSelected(day) && colorStyles.text,
                        )}>
                        {day}
                      </Text>
                    </Pressable>
                  ),
                )}
              </View>
            ))}
          </View>
        )}

        {showTime && (
          <View className={NATIVE_CALENDAR_TIME_ROW_CLASS}>
            <TimeColumn
              label="HH"
              value={hours}
              max={23}
              onChange={handleHoursChange}
              testID={testID ? `${testID}-hours` : undefined}
            />
            <TimeColumn
              label="MM"
              value={minutes}
              max={59}
              onChange={handleMinutesChange}
              testID={testID ? `${testID}-minutes` : undefined}
            />
            <TimeColumn
              label="SS"
              value={seconds}
              max={59}
              onChange={handleSecondsChange}
              testID={testID ? `${testID}-seconds` : undefined}
            />
          </View>
        )}
      </View>
    </Surface>
  );
}
